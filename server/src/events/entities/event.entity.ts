import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum EventType {
  ACCOUNT_CREATED = 'account-created',
  ACCOUNT_CLOSED = 'account-closed',
  DEPOSIT_MADE = 'deposit-made',
  WITHDRAWAL_MADE = 'withdrawal-made',
  TRANSFER_SENT = 'transfer-sent',
  TRANSFER_RECEIVED = 'transfer-received',
  EXTERNAL_TRANSFER_SENT = 'external-transfer-sent',
  SCHEDULED_PAYMENT_CREATED = 'scheduled-payment-created',
  SCHEDULED_PAYMENT_EXECUTED = 'scheduled-payment-executed',
  LOAN_APPLIED = 'loan-applied',
  LOAN_APPROVED = 'loan-approved',
  LOAN_REJECTED = 'loan-rejected',
  LOAN_PAYMENT_MADE = 'loan-payment-made',
  LOAN_PAYMENT_MISSED = 'loan-payment-missed',
  LOAN_COMPLETED = 'loan-completed',
}

export enum EventStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
}

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Unique identifier for the event' })
  id: number;

  @Column({ type: 'varchar', length: 36, unique: true })
  @ApiProperty({ description: 'UUID for the event', example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6' })
  eventId: string;

  @Column({
    type: 'varchar',
    length: 50,
    enum: EventType,
  })
  @ApiProperty({ 
    description: 'Type of event',
    enum: EventType,
    example: EventType.DEPOSIT_MADE,
  })
  type: string;

  @Column({ type: 'datetime' })
  @ApiProperty({ description: 'When the event occurred' })
  occurredAt: string;

  @Column({ type: 'text' })
  @ApiProperty({ 
    description: 'Event payload as JSON string',
    example: '{"accountId":"1234-5678-9000","amount":150.00,"currency":"USD","channel":"web-simulator"}',
  })
  payload: string;

  @Column({
    type: 'varchar',
    length: 20,
    enum: EventStatus,
    default: EventStatus.PENDING,
  })
  @ApiProperty({
    description: 'Status of the event',
    enum: EventStatus,
    example: EventStatus.SENT,
  })
  status: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ 
    description: 'Response from Optio API',
    required: false,
  })
  optioResponse?: string;

  @Column({ type: 'datetime' })
  @ApiProperty({ description: 'When the event was created' })
  createdAt: Date;
}
