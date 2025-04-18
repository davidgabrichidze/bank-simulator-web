import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Account } from './entities/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { EventsService } from '../events/events.service';
import { EventType } from '../events/entities/event.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    private eventsService: EventsService,
  ) {}

  async findAll(): Promise<Account[]> {
    return this.accountRepository.find();
  }

  async findOne(id: number): Promise<Account> {
    return this.accountRepository.findOneBy({ id });
  }

  async findByAccountNumber(accountNumber: string): Promise<Account> {
    return this.accountRepository.findOneBy({ accountNumber });
  }

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    // Generate a random account number
    const accountNumber = this.generateAccountNumber();
    
    const account = this.accountRepository.create({
      ...createAccountDto,
      accountNumber,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    const savedAccount = await this.accountRepository.save(account);
    
    // Create account creation event for Optio CDP
    await this.eventsService.createEvent({
      eventId: uuidv4(),
      type: EventType.ACCOUNT_CREATED,
      occurredAt: new Date().toISOString(),
      payload: JSON.stringify({
        accountId: accountNumber,
        type: account.type,
        currency: account.currency,
        initialBalance: account.balance,
        channel: 'web-simulator',
      }),
    });
    
    return savedAccount;
  }

  async close(id: number): Promise<void> {
    const account = await this.findOne(id);
    
    account.isActive = false;
    account.updatedAt = new Date();
    
    await this.accountRepository.save(account);
    
    // Create account closure event for Optio CDP
    await this.eventsService.createEvent({
      eventId: uuidv4(),
      type: EventType.ACCOUNT_CLOSED,
      occurredAt: new Date().toISOString(),
      payload: JSON.stringify({
        accountId: account.accountNumber,
        finalBalance: account.balance,
        channel: 'web-simulator',
      }),
    });
  }

  async updateBalance(id: number, amount: number): Promise<Account> {
    const account = await this.findOne(id);
    
    account.balance += amount;
    account.updatedAt = new Date();
    
    return this.accountRepository.save(account);
  }

  private generateAccountNumber(): string {
    // Generate a random 12-digit account number in format XXXX-XXXX-XXXX
    const part1 = Math.floor(1000 + Math.random() * 9000).toString();
    const part2 = Math.floor(1000 + Math.random() * 9000).toString();
    const part3 = Math.floor(1000 + Math.random() * 9000).toString();
    
    return `${part1}-${part2}-${part3}`;
  }
}
