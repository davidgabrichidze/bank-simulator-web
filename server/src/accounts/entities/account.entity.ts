import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { ScheduledPayment } from '../../transactions/entities/scheduled-payment.entity';
import { Loan } from '../../loans/entities/loan.entity';

export enum AccountType {
  PERSONAL = 'personal',
  BUSINESS = 'business',
}

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Unique identifier for the account' })
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  @ApiProperty({ description: 'Account number', example: '1234-5678-9000' })
  accountNumber: string;

  @Column({ type: 'varchar', length: 100 })
  @ApiProperty({ description: 'Account name', example: 'Personal Checking' })
  name: string;

  @Column({ type: 'varchar', length: 20 })
  @ApiProperty({ description: 'Account type', enum: AccountType, example: 'personal' })
  type: string;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  @ApiProperty({ description: 'Account currency', example: 'USD' })
  currency: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  @ApiProperty({ description: 'Account balance', example: 1000.50 })
  balance: number;

  @Column({ type: 'boolean', default: true })
  @ApiProperty({ description: 'Whether the account is active', example: true })
  isActive: boolean;

  @Column({ type: 'datetime' })
  @ApiProperty({ description: 'When the account was created' })
  createdAt: Date;

  @Column({ type: 'datetime' })
  @ApiProperty({ description: 'When the account was last updated' })
  updatedAt: Date;

  @OneToMany(() => Transaction, transaction => transaction.account)
  transactions: Transaction[];

  @OneToMany(() => ScheduledPayment, payment => payment.account)
  scheduledPayments: ScheduledPayment[];

  @OneToMany(() => Loan, loan => loan.account)
  loans: Loan[];
}
