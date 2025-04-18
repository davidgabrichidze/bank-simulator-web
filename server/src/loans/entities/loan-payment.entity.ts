import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Loan } from './loan.entity';

@Entity('loan_payments')
export class LoanPayment {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Unique identifier for the payment' })
  id: number;

  @ManyToOne(() => Loan, loan => loan.payments)
  @JoinColumn({ name: 'loan_id' })
  loan: Loan;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  @ApiProperty({ description: 'Payment amount', example: 300.00 })
  amount: number;

  @Column({ type: 'datetime' })
  @ApiProperty({ description: 'Payment due date' })
  dueDate: Date;

  @Column({ type: 'boolean', default: false })
  @ApiProperty({ description: 'Whether the payment has been made', example: false })
  isPaid: boolean;

  @Column({ type: 'datetime', nullable: true })
  @ApiProperty({ 
    description: 'When the payment was actually made',
    required: false,
  })
  paymentDate?: Date;

  @Column({ type: 'datetime' })
  @ApiProperty({ description: 'When the payment record was created' })
  createdAt: Date;
}
