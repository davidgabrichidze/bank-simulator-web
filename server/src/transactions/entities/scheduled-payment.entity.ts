import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Account } from '../../accounts/entities/account.entity';

export enum PaymentFrequency {
  ONE_OFF = 'one-off',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

@Entity('scheduled_payments')
export class ScheduledPayment {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Unique identifier for the scheduled payment' })
  id: number;

  @ManyToOne(() => Account, account => account.scheduledPayments)
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  @ApiProperty({ description: 'Payment amount', example: 150.00 })
  amount: number;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  @ApiProperty({ description: 'Payment currency', example: 'USD' })
  currency: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ 
    description: 'Optional payment description',
    example: 'Monthly rent',
    required: false,
  })
  description?: string;

  @ManyToOne(() => Account, { nullable: true })
  @JoinColumn({ name: 'target_account_id' })
  targetAccount?: Account;

  @Column({
    type: 'varchar',
    length: 20,
    enum: PaymentFrequency,
  })
  @ApiProperty({
    description: 'Payment frequency',
    enum: PaymentFrequency,
    example: PaymentFrequency.MONTHLY,
  })
  frequency: string;

  @Column({ type: 'datetime' })
  @ApiProperty({ description: 'Date of the next payment' })
  nextPaymentDate: Date;

  @Column({ type: 'datetime', nullable: true })
  @ApiProperty({ 
    description: 'End date for recurring payments',
    required: false,
  })
  endDate?: Date;

  @Column({ type: 'boolean', default: true })
  @ApiProperty({ description: 'Whether the scheduled payment is active', example: true })
  isActive: boolean;

  @Column({ type: 'datetime' })
  @ApiProperty({ description: 'When the scheduled payment was created' })
  createdAt: Date;
}
