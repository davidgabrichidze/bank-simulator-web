import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Account } from '../../accounts/entities/account.entity';

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  TRANSFER = 'transfer',
  LOAN_PAYMENT = 'loan-payment',
  SCHEDULED_PAYMENT = 'scheduled-payment',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Unique identifier for the transaction' })
  id: number;

  @ManyToOne(() => Account, account => account.transactions)
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @Column({
    type: 'varchar',
    length: 20,
    enum: TransactionType,
  })
  @ApiProperty({
    description: 'Type of transaction',
    enum: TransactionType,
    example: TransactionType.DEPOSIT,
  })
  type: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  @ApiProperty({ description: 'Transaction amount', example: 150.00 })
  amount: number;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  @ApiProperty({ description: 'Transaction currency', example: 'USD' })
  currency: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ 
    description: 'Optional transaction description',
    example: 'Salary deposit',
    required: false,
  })
  description?: string;

  @ManyToOne(() => Account, { nullable: true })
  @JoinColumn({ name: 'target_account_id' })
  targetAccount?: Account;

  @Column({
    type: 'varchar',
    length: 20,
    enum: TransactionStatus,
    default: TransactionStatus.COMPLETED,
  })
  @ApiProperty({
    description: 'Status of the transaction',
    enum: TransactionStatus,
    example: TransactionStatus.COMPLETED,
  })
  status: string;

  @Column({ type: 'datetime' })
  @ApiProperty({ description: 'When the transaction occurred' })
  transactionDate: Date;

  @Column({ type: 'datetime' })
  @ApiProperty({ description: 'When the transaction was created' })
  createdAt: Date;
}
