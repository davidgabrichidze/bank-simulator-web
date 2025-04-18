export interface Event {
  id: number;
  eventId: string; // UUID
  type: EventType;
  occurredAt: string;
  payload: string; // JSON string
  status: EventStatus;
  optioResponse?: string;
  createdAt: string;
}

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
  LOAN_COMPLETED = 'loan-completed'
}

export enum EventStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed'
}

export interface OptioEventPayload {
  eventId: string;
  type: string;
  occurredAt: string;
  payload: {
    accountId?: string;
    amount?: number;
    currency?: string;
    channel: string;
    [key: string]: any;
  };
}
