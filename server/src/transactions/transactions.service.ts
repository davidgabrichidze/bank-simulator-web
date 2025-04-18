import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Transaction, TransactionType, TransactionStatus } from './entities/transaction.entity';
import { ScheduledPayment, PaymentFrequency } from './entities/scheduled-payment.entity';
import { AccountsService } from '../accounts/accounts.service';
import { EventsService } from '../events/events.service';
import { EventType } from '../events/entities/event.entity';
import { 
  DepositDto, 
  WithdrawalDto, 
  TransferDto, 
  ExternalTransferDto,
  ScheduledPaymentDto
} from './dto/transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(ScheduledPayment)
    private scheduledPaymentRepository: Repository<ScheduledPayment>,
    private accountsService: AccountsService,
    private eventsService: EventsService,
  ) {}

  async findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find({
      order: { transactionDate: 'DESC' },
      relations: ['account'],
    });
  }

  async findByAccount(accountId: number): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { account: { id: accountId } },
      order: { transactionDate: 'DESC' },
      relations: ['account'],
    });
  }

  async deposit(depositDto: DepositDto): Promise<Transaction> {
    const { accountId, amount, currency, description } = depositDto;
    
    // Validate the account exists
    const account = await this.accountsService.findOne(accountId);
    if (!account) {
      throw new Error(`Account with ID ${accountId} not found`);
    }
    
    if (!account.isActive) {
      throw new Error(`Cannot deposit to closed account ${account.accountNumber}`);
    }
    
    // Update account balance
    await this.accountsService.updateBalance(accountId, amount);
    
    // Create transaction record
    const transaction = this.transactionRepository.create({
      account,
      type: TransactionType.DEPOSIT,
      amount,
      currency,
      description,
      status: TransactionStatus.COMPLETED,
      transactionDate: new Date(),
      createdAt: new Date(),
    });
    
    const savedTransaction = await this.transactionRepository.save(transaction);
    
    // Create deposit event for Optio CDP
    await this.eventsService.createEvent({
      eventId: uuidv4(),
      type: EventType.DEPOSIT_MADE,
      occurredAt: new Date().toISOString(),
      payload: JSON.stringify({
        accountId: account.accountNumber,
        amount,
        currency,
        channel: 'web-simulator',
      }),
    });
    
    return savedTransaction;
  }

  async withdraw(withdrawalDto: WithdrawalDto): Promise<Transaction> {
    const { accountId, amount, currency, description } = withdrawalDto;
    
    // Validate the account exists
    const account = await this.accountsService.findOne(accountId);
    if (!account) {
      throw new Error(`Account with ID ${accountId} not found`);
    }
    
    if (!account.isActive) {
      throw new Error(`Cannot withdraw from closed account ${account.accountNumber}`);
    }
    
    // Check if there are sufficient funds
    if (account.balance < amount) {
      throw new Error(`Insufficient funds in account ${account.accountNumber}`);
    }
    
    // Update account balance (subtract amount)
    await this.accountsService.updateBalance(accountId, -amount);
    
    // Create transaction record
    const transaction = this.transactionRepository.create({
      account,
      type: TransactionType.WITHDRAWAL,
      amount,
      currency,
      description,
      status: TransactionStatus.COMPLETED,
      transactionDate: new Date(),
      createdAt: new Date(),
    });
    
    const savedTransaction = await this.transactionRepository.save(transaction);
    
    // Create withdrawal event for Optio CDP
    await this.eventsService.createEvent({
      eventId: uuidv4(),
      type: EventType.WITHDRAWAL_MADE,
      occurredAt: new Date().toISOString(),
      payload: JSON.stringify({
        accountId: account.accountNumber,
        amount,
        currency,
        channel: 'web-simulator',
      }),
    });
    
    return savedTransaction;
  }

  async transfer(transferDto: TransferDto): Promise<Transaction> {
    const { sourceAccountId, targetAccountId, amount, currency, description } = transferDto;
    
    // Validate accounts exist
    const sourceAccount = await this.accountsService.findOne(sourceAccountId);
    if (!sourceAccount) {
      throw new Error(`Source account with ID ${sourceAccountId} not found`);
    }
    
    const targetAccount = await this.accountsService.findOne(targetAccountId);
    if (!targetAccount) {
      throw new Error(`Target account with ID ${targetAccountId} not found`);
    }
    
    // Check accounts are active
    if (!sourceAccount.isActive) {
      throw new Error(`Cannot transfer from closed account ${sourceAccount.accountNumber}`);
    }
    
    if (!targetAccount.isActive) {
      throw new Error(`Cannot transfer to closed account ${targetAccount.accountNumber}`);
    }
    
    // Check if accounts are different
    if (sourceAccountId === targetAccountId) {
      throw new Error(`Source and target accounts cannot be the same`);
    }
    
    // Check if there are sufficient funds
    if (sourceAccount.balance < amount) {
      throw new Error(`Insufficient funds in source account ${sourceAccount.accountNumber}`);
    }
    
    // Create transaction record for the transfer
    const transaction = this.transactionRepository.create({
      account: sourceAccount,
      type: TransactionType.TRANSFER,
      amount,
      currency,
      description,
      targetAccount,
      status: TransactionStatus.COMPLETED,
      transactionDate: new Date(),
      createdAt: new Date(),
    });
    
    // Update account balances
    await this.accountsService.updateBalance(sourceAccountId, -amount);
    await this.accountsService.updateBalance(targetAccountId, amount);
    
    const savedTransaction = await this.transactionRepository.save(transaction);
    
    // Create transfer sent event for Optio CDP
    await this.eventsService.createEvent({
      eventId: uuidv4(),
      type: EventType.TRANSFER_SENT,
      occurredAt: new Date().toISOString(),
      payload: JSON.stringify({
        accountId: sourceAccount.accountNumber,
        targetAccountId: targetAccount.accountNumber,
        amount,
        currency,
        channel: 'web-simulator',
      }),
    });
    
    // Create transfer received event for Optio CDP
    await this.eventsService.createEvent({
      eventId: uuidv4(),
      type: EventType.TRANSFER_RECEIVED,
      occurredAt: new Date().toISOString(),
      payload: JSON.stringify({
        accountId: targetAccount.accountNumber,
        sourceAccountId: sourceAccount.accountNumber,
        amount,
        currency,
        channel: 'web-simulator',
      }),
    });
    
    return savedTransaction;
  }

  async externalTransfer(transferDto: ExternalTransferDto): Promise<Transaction> {
    const { sourceAccountId, beneficiaryName, beneficiaryAccount, beneficiaryBank, beneficiarySwiftCode, amount, currency, description } = transferDto;
    
    // Validate source account exists
    const sourceAccount = await this.accountsService.findOne(sourceAccountId);
    if (!sourceAccount) {
      throw new Error(`Source account with ID ${sourceAccountId} not found`);
    }
    
    // Check account is active
    if (!sourceAccount.isActive) {
      throw new Error(`Cannot transfer from closed account ${sourceAccount.accountNumber}`);
    }
    
    // Check if there are sufficient funds
    if (sourceAccount.balance < amount) {
      throw new Error(`Insufficient funds in source account ${sourceAccount.accountNumber}`);
    }
    
    // Create transaction record for the external transfer
    const transaction = this.transactionRepository.create({
      account: sourceAccount,
      type: TransactionType.TRANSFER,
      amount,
      currency,
      description: description || `External transfer to ${beneficiaryName} at ${beneficiaryBank}`,
      status: TransactionStatus.COMPLETED,
      transactionDate: new Date(),
      createdAt: new Date(),
    });
    
    // Update account balance
    await this.accountsService.updateBalance(sourceAccountId, -amount);
    
    const savedTransaction = await this.transactionRepository.save(transaction);
    
    // Create external transfer event for Optio CDP
    await this.eventsService.createEvent({
      eventId: uuidv4(),
      type: EventType.EXTERNAL_TRANSFER_SENT,
      occurredAt: new Date().toISOString(),
      payload: JSON.stringify({
        accountId: sourceAccount.accountNumber,
        beneficiaryName,
        beneficiaryAccount,
        beneficiaryBank,
        beneficiarySwiftCode,
        amount,
        currency,
        channel: 'web-simulator',
      }),
    });
    
    return savedTransaction;
  }

  // Scheduled Payments
  async findAllScheduledPayments(): Promise<ScheduledPayment[]> {
    return this.scheduledPaymentRepository.find({
      order: { nextPaymentDate: 'ASC' },
      relations: ['account'],
    });
  }

  async findScheduledPaymentsByAccount(accountId: number): Promise<ScheduledPayment[]> {
    return this.scheduledPaymentRepository.find({
      where: { account: { id: accountId } },
      order: { nextPaymentDate: 'ASC' },
      relations: ['account'],
    });
  }

  async createScheduledPayment(paymentDto: ScheduledPaymentDto): Promise<ScheduledPayment> {
    const { accountId, targetAccountId, amount, currency, description, frequency, nextPaymentDate, endDate } = paymentDto;
    
    // Validate account exists
    const account = await this.accountsService.findOne(accountId);
    if (!account) {
      throw new Error(`Account with ID ${accountId} not found`);
    }
    
    // Check account is active
    if (!account.isActive) {
      throw new Error(`Cannot schedule payments from closed account ${account.accountNumber}`);
    }
    
    // Validate target account if provided
    let targetAccount = null;
    if (targetAccountId) {
      targetAccount = await this.accountsService.findOne(targetAccountId);
      if (!targetAccount) {
        throw new Error(`Target account with ID ${targetAccountId} not found`);
      }
      
      if (!targetAccount.isActive) {
        throw new Error(`Cannot schedule payments to closed account ${targetAccount.accountNumber}`);
      }
    }
    
    // Create scheduled payment record
    const scheduledPayment = this.scheduledPaymentRepository.create({
      account,
      targetAccount,
      amount,
      currency,
      description,
      frequency,
      nextPaymentDate: new Date(nextPaymentDate),
      endDate: endDate ? new Date(endDate) : null,
      isActive: true,
      createdAt: new Date(),
    });
    
    const savedPayment = await this.scheduledPaymentRepository.save(scheduledPayment);
    
    // Create scheduled payment event for Optio CDP
    await this.eventsService.createEvent({
      eventId: uuidv4(),
      type: EventType.SCHEDULED_PAYMENT_CREATED,
      occurredAt: new Date().toISOString(),
      payload: JSON.stringify({
        accountId: account.accountNumber,
        targetAccountId: targetAccount?.accountNumber,
        amount,
        currency,
        frequency,
        nextPaymentDate,
        endDate,
        channel: 'web-simulator',
      }),
    });
    
    return savedPayment;
  }

  async cancelScheduledPayment(id: number): Promise<void> {
    const payment = await this.scheduledPaymentRepository.findOne({
      where: { id },
      relations: ['account'],
    });
    
    if (!payment) {
      throw new Error(`Scheduled payment with ID ${id} not found`);
    }
    
    payment.isActive = false;
    
    await this.scheduledPaymentRepository.save(payment);
  }

  // Helper for processing scheduled payments (to be called by a cron job)
  async processScheduledPayments(): Promise<void> {
    const now = new Date();
    const duePayments = await this.scheduledPaymentRepository.find({
      where: {
        nextPaymentDate: { lessThanOrEqual: now },
        isActive: true,
      },
      relations: ['account', 'targetAccount'],
    });
    
    for (const payment of duePayments) {
      try {
        // Check if account has enough funds
        if (payment.account.balance < payment.amount) {
          // Log this situation for monitoring
          console.error(`Insufficient funds for scheduled payment ${payment.id} from account ${payment.account.accountNumber}`);
          continue;
        }
        
        // Perform the transfer/payment
        if (payment.targetAccount) {
          // Internal transfer
          await this.transfer({
            sourceAccountId: payment.account.id,
            targetAccountId: payment.targetAccount.id,
            amount: payment.amount,
            currency: payment.currency,
            description: payment.description || 'Scheduled payment',
          });
        } else {
          // External payment
          await this.withdraw({
            accountId: payment.account.id,
            amount: payment.amount,
            currency: payment.currency,
            description: payment.description || 'Scheduled payment',
          });
        }
        
        // Create scheduled payment executed event for Optio CDP
        await this.eventsService.createEvent({
          eventId: uuidv4(),
          type: EventType.SCHEDULED_PAYMENT_EXECUTED,
          occurredAt: new Date().toISOString(),
          payload: JSON.stringify({
            accountId: payment.account.accountNumber,
            targetAccountId: payment.targetAccount?.accountNumber,
            amount: payment.amount,
            currency: payment.currency,
            channel: 'web-simulator',
          }),
        });
        
        // Update nextPaymentDate based on frequency
        if (payment.frequency === PaymentFrequency.ONE_OFF) {
          payment.isActive = false;
        } else {
          const nextDate = new Date(payment.nextPaymentDate);
          
          if (payment.frequency === PaymentFrequency.WEEKLY) {
            nextDate.setDate(nextDate.getDate() + 7);
          } else if (payment.frequency === PaymentFrequency.MONTHLY) {
            nextDate.setMonth(nextDate.getMonth() + 1);
          }
          
          // Check if we've reached the end date
          if (payment.endDate && nextDate > payment.endDate) {
            payment.isActive = false;
          } else {
            payment.nextPaymentDate = nextDate;
          }
        }
        
        await this.scheduledPaymentRepository.save(payment);
        
      } catch (error) {
        console.error(`Error processing scheduled payment ${payment.id}:`, error);
      }
    }
  }
}
