export interface Transaction {
  id: number;
  accountId: number;
  type: TransactionType;
  amount: number;
  currency: string;
  description?: string;
  targetAccountId?: number;
  status: TransactionStatus;
  transactionDate: string;
  createdAt: string;
}

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  TRANSFER = 'transfer',
  LOAN_PAYMENT = 'loan-payment',
  SCHEDULED_PAYMENT = 'scheduled-payment'
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export interface DepositRequest {
  accountId: number;
  amount: number;
  currency: string;
  description?: string;
}

export interface WithdrawalRequest {
  accountId: number;
  amount: number;
  currency: string;
  description?: string;
}

export interface TransferRequest {
  sourceAccountId: number;
  targetAccountId: number;
  amount: number;
  currency: string;
  description?: string;
}

export interface ExternalTransferRequest {
  sourceAccountId: number;
  beneficiaryName: string;
  beneficiaryAccount: string;
  beneficiaryBank: string;
  beneficiarySwiftCode?: string;
  amount: number;
  currency: string;
  description?: string;
}

export interface ScheduledPaymentRequest {
  accountId: number;
  targetAccountId?: number;
  amount: number;
  currency: string;
  description?: string;
  frequency: PaymentFrequency;
  nextPaymentDate: string;
  endDate?: string;
}

export enum PaymentFrequency {
  ONE_OFF = 'one-off',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly'
}

export interface ScheduledPayment {
  id: number;
  accountId: number;
  amount: number;
  currency: string;
  description?: string;
  targetAccountId?: number;
  frequency: PaymentFrequency;
  nextPaymentDate: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
}
