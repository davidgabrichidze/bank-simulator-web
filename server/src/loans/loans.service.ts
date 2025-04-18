import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Loan, LoanStatus } from './entities/loan.entity';
import { LoanPayment } from './entities/loan-payment.entity';
import { AccountsService } from '../accounts/accounts.service';
import { EventsService } from '../events/events.service';
import { EventType } from '../events/entities/event.entity';
import { 
  LoanApplicationDto, 
  PayLoanInstallmentDto, 
  MarkInstallmentAsMissedDto 
} from './dto/loan.dto';

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(Loan)
    private loanRepository: Repository<Loan>,
    @InjectRepository(LoanPayment)
    private loanPaymentRepository: Repository<LoanPayment>,
    private accountsService: AccountsService,
    private eventsService: EventsService,
  ) {}

  async findAll(): Promise<Loan[]> {
    return this.loanRepository.find({
      relations: ['account'],
    });
  }

  async findByAccount(accountId: number): Promise<Loan[]> {
    return this.loanRepository.find({
      where: { account: { id: accountId } },
      relations: ['account'],
    });
  }

  async findOne(id: number): Promise<Loan> {
    return this.loanRepository.findOne({
      where: { id },
      relations: ['account'],
    });
  }

  async applyForLoan(loanApplicationDto: LoanApplicationDto): Promise<Loan> {
    const { accountId, amount, currency, interestRate, term, startDate } = loanApplicationDto;
    
    // Validate the account exists
    const account = await this.accountsService.findOne(accountId);
    if (!account) {
      throw new Error(`Account with ID ${accountId} not found`);
    }
    
    if (!account.isActive) {
      throw new Error(`Cannot apply for a loan with closed account ${account.accountNumber}`);
    }
    
    // Generate a credit score (mock logic for simulation)
    const creditScore = this.generateCreditScore();
    
    // Determine loan approval status based on credit score
    const status = this.determineLoanStatus(creditScore);
    
    // Create the loan
    const loan = this.loanRepository.create({
      account,
      amount,
      currency,
      interestRate,
      term,
      startDate: new Date(startDate),
      status,
      creditScore,
      createdAt: new Date(),
    });
    
    const savedLoan = await this.loanRepository.save(loan);
    
    // Create event for Optio CDP
    await this.eventsService.createEvent({
      eventId: uuidv4(),
      type: EventType.LOAN_APPLIED,
      occurredAt: new Date().toISOString(),
      payload: JSON.stringify({
        accountId: account.accountNumber,
        loanId: savedLoan.id,
        amount,
        currency,
        interestRate,
        term,
        creditScore,
        status,
        channel: 'web-simulator',
      }),
    });
    
    // If loan is approved, generate payment schedule and add funds to account
    if (status === LoanStatus.APPROVED) {
      await this.generatePaymentSchedule(savedLoan);
      await this.accountsService.updateBalance(accountId, amount);
      
      // Create loan approved event
      await this.eventsService.createEvent({
        eventId: uuidv4(),
        type: EventType.LOAN_APPROVED,
        occurredAt: new Date().toISOString(),
        payload: JSON.stringify({
          accountId: account.accountNumber,
          loanId: savedLoan.id,
          amount,
          currency,
          channel: 'web-simulator',
        }),
      });
    } else if (status === LoanStatus.REJECTED) {
      // Create loan rejected event
      await this.eventsService.createEvent({
        eventId: uuidv4(),
        type: EventType.LOAN_REJECTED,
        occurredAt: new Date().toISOString(),
        payload: JSON.stringify({
          accountId: account.accountNumber,
          loanId: savedLoan.id,
          reason: 'Low credit score',
          channel: 'web-simulator',
        }),
      });
    }
    
    return savedLoan;
  }

  async getLoanPayments(loanId: number): Promise<LoanPayment[]> {
    return this.loanPaymentRepository.find({
      where: { loan: { id: loanId } },
      order: { dueDate: 'ASC' },
      relations: ['loan'],
    });
  }

  async payLoanInstallment(paymentDto: PayLoanInstallmentDto): Promise<LoanPayment> {
    const { loanId, paymentId, date } = paymentDto;
    
    // Find the loan
    const loan = await this.findOne(loanId);
    if (!loan) {
      throw new Error(`Loan with ID ${loanId} not found`);
    }
    
    // Find the payment
    const payment = await this.loanPaymentRepository.findOne({
      where: { id: paymentId, loan: { id: loanId } },
      relations: ['loan'],
    });
    
    if (!payment) {
      throw new Error(`Payment with ID ${paymentId} not found for loan ${loanId}`);
    }
    
    if (payment.isPaid) {
      throw new Error(`Payment with ID ${paymentId} has already been paid`);
    }
    
    // Verify the account has enough funds
    const account = await this.accountsService.findOne(loan.account.id);
    if (account.balance < payment.amount) {
      throw new Error(`Insufficient funds in account ${account.accountNumber} to make loan payment`);
    }
    
    // Update payment record
    payment.isPaid = true;
    payment.paymentDate = new Date(date);
    
    // Deduct the payment from account balance
    await this.accountsService.updateBalance(loan.account.id, -payment.amount);
    
    const savedPayment = await this.loanPaymentRepository.save(payment);
    
    // Create loan payment event
    await this.eventsService.createEvent({
      eventId: uuidv4(),
      type: EventType.LOAN_PAYMENT_MADE,
      occurredAt: new Date().toISOString(),
      payload: JSON.stringify({
        accountId: account.accountNumber,
        loanId: loan.id,
        paymentId: payment.id,
        amount: payment.amount,
        currency: loan.currency,
        channel: 'web-simulator',
      }),
    });
    
    // Check if all payments are completed, and update loan status if necessary
    await this.checkLoanCompletion(loanId);
    
    return savedPayment;
  }

  async markInstallmentAsMissed(missedDto: MarkInstallmentAsMissedDto): Promise<LoanPayment> {
    const { loanId, paymentId } = missedDto;
    
    // Find the loan
    const loan = await this.findOne(loanId);
    if (!loan) {
      throw new Error(`Loan with ID ${loanId} not found`);
    }
    
    // Find the payment
    const payment = await this.loanPaymentRepository.findOne({
      where: { id: paymentId, loan: { id: loanId } },
      relations: ['loan'],
    });
    
    if (!payment) {
      throw new Error(`Payment with ID ${paymentId} not found for loan ${loanId}`);
    }
    
    if (payment.isPaid) {
      throw new Error(`Payment with ID ${paymentId} has already been paid`);
    }
    
    // Create loan payment missed event
    await this.eventsService.createEvent({
      eventId: uuidv4(),
      type: EventType.LOAN_PAYMENT_MISSED,
      occurredAt: new Date().toISOString(),
      payload: JSON.stringify({
        accountId: loan.account.accountNumber,
        loanId: loan.id,
        paymentId: payment.id,
        amount: payment.amount,
        currency: loan.currency,
        channel: 'web-simulator',
      }),
    });
    
    return payment;
  }

  private generateCreditScore(): number {
    // Generate a random credit score between 300 and 850
    return Math.floor(Math.random() * (850 - 300 + 1)) + 300;
  }

  private determineLoanStatus(creditScore: number): LoanStatus {
    // Simple credit score evaluation
    if (creditScore >= 700) {
      return LoanStatus.APPROVED;
    } else if (creditScore >= 600) {
      // Random approval for medium scores
      return Math.random() > 0.5 ? LoanStatus.APPROVED : LoanStatus.REJECTED;
    } else {
      return LoanStatus.REJECTED;
    }
  }

  private async generatePaymentSchedule(loan: Loan): Promise<void> {
    const { amount, interestRate, term, startDate, currency } = loan;
    
    // Calculate monthly payment using standard loan formula
    const monthlyRate = interestRate / 100 / 12;
    const monthlyPayment = amount * monthlyRate * Math.pow(1 + monthlyRate, term) / 
                          (Math.pow(1 + monthlyRate, term) - 1);
    
    // Generate payment schedule
    const payments: LoanPayment[] = [];
    let remainingPrincipal = amount;
    let dueDate = new Date(startDate);
    
    // Set loan status to active now that it's approved and payments are being generated
    loan.status = LoanStatus.ACTIVE;
    await this.loanRepository.save(loan);
    
    for (let i = 0; i < term; i++) {
      // Calculate interest for this period
      const interestPayment = remainingPrincipal * monthlyRate;
      let principalPayment = monthlyPayment - interestPayment;
      
      // Adjust final payment if there's a rounding issue
      if (i === term - 1) {
        principalPayment = remainingPrincipal;
      }
      
      remainingPrincipal -= principalPayment;
      
      // Add a month to the due date
      dueDate = new Date(dueDate);
      dueDate.setMonth(dueDate.getMonth() + 1);
      
      const payment = this.loanPaymentRepository.create({
        loan,
        amount: monthlyPayment,
        dueDate: new Date(dueDate),
        isPaid: false,
        createdAt: new Date(),
      });
      
      payments.push(payment);
    }
    
    await this.loanPaymentRepository.save(payments);
  }

  private async checkLoanCompletion(loanId: number): Promise<void> {
    const payments = await this.loanPaymentRepository.find({
      where: { loan: { id: loanId } },
    });
    
    // Check if all payments are completed
    const allPaid = payments.every(payment => payment.isPaid);
    
    if (allPaid) {
      const loan = await this.findOne(loanId);
      loan.status = LoanStatus.COMPLETED;
      await this.loanRepository.save(loan);
      
      // Create loan completed event
      await this.eventsService.createEvent({
        eventId: uuidv4(),
        type: EventType.LOAN_COMPLETED,
        occurredAt: new Date().toISOString(),
        payload: JSON.stringify({
          accountId: loan.account.accountNumber,
          loanId: loan.id,
          channel: 'web-simulator',
        }),
      });
    }
  }
}
