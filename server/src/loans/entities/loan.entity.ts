import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Account } from '../../accounts/entities/account.entity';
import { LoanPayment } from './loan-payment.entity';

export enum LoanStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

@Entity('loans')
export class Loan {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Unique identifier for the loan' })
  id: number;

  @ManyToOne(() => Account, account => account.loans)
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  @ApiProperty({ description: 'Loan amount', example: 10000.00 })
  amount: number;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  @ApiProperty({ description: 'Loan currency', example: 'USD' })
  currency: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  @ApiProperty({ description: 'Annual interest rate (%)', example: 5.5 })
  interestRate: number;

  @Column({ type: 'integer' })
  @ApiProperty({ description: 'Loan term in months', example: 36 })
  term: number;

  @Column({ type: 'datetime' })
  @ApiProperty({ description: 'Loan start date' })
  startDate: Date;

  @Column({
    type: 'varchar',
    length: 20,
    enum: LoanStatus,
    default: LoanStatus.PENDING,
  })
  @ApiProperty({
    description: 'Status of the loan',
    enum: LoanStatus,
    example: LoanStatus.APPROVED,
  })
  status: string;

  @Column({ type: 'integer', nullable: true })
  @ApiProperty({ 
    description: 'Credit score of the applicant',
    example: 750,
    required: false,
  })
  creditScore?: number;

  @Column({ type: 'datetime' })
  @ApiProperty({ description: 'When the loan was created' })
  createdAt: Date;

  @OneToMany(() => LoanPayment, payment => payment.loan)
  payments: LoanPayment[];
}
