// Account types
export interface Account {
  id: number;
  accountNumber: string;
  type: 'personal' | 'business';
  balance: number;
  currency: string;
  status: 'active' | 'closed';
  createdAt: string;
  closedAt?: string;
}

// Transaction types
export interface Transaction {
  id: number;
  accountId: number;
  targetAccountId?: number;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'external-transfer';
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  reference?: string;
  createdAt: string;
}

// Scheduled payment types
export interface ScheduledPayment {
  id: number;
  accountId: number;
  targetAccountId: number;
  amount: number;
  currency: string;
  frequency: 'one-off' | 'weekly' | 'monthly';
  startDate: string;
  nextDate?: string;
  reference?: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
}

// Loan types
export interface Loan {
  id: number;
  accountId: number;
  amount: number;
  currency: string;
  interestRate: number;
  term: number; // In months
  startDate: string;
  endDate?: string;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed';
  creditScore?: number;
  createdAt: string;
}

// Loan payment types
export interface LoanPayment {
  id: number;
  loanId: number;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  paymentDate?: string;
  createdAt: string;
}

// Event types
export interface Event {
  id: number;
  eventId: string;
  type: string;
  occurredAt: string;
  payload: string;
  status: 'pending' | 'sent' | 'failed';
  optioResponse?: string;
  createdAt: string;
}

// Setting types
export interface Setting {
  id: number;
  key: string;
  value: string;
  updatedAt: string;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Form types
export interface CreateAccountFormData {
  type: 'personal' | 'business';
  currency: string;
  initialBalance: number;
}

export interface DepositFormData {
  accountId: number;
  amount: number;
}

export interface WithdrawalFormData {
  accountId: number;
  amount: number;
}

export interface TransferFormData {
  accountId: number;
  targetAccountId: number;
  amount: number;
  reference?: string;
}

export interface ExternalTransferFormData {
  accountId: number;
  beneficiaryName: string;
  beneficiaryAccount: string;
  bankCode: string;
  amount: number;
  reference?: string;
}

export interface ScheduledPaymentFormData {
  accountId: number;
  targetAccountId: number;
  amount: number;
  frequency: 'one-off' | 'weekly' | 'monthly';
  startDate: string;
  reference?: string;
}

export interface LoanApplicationFormData {
  accountId: number;
  amount: number;
  currency: string;
  interestRate: number;
  term: number;
  startDate: string;
}

export interface PayLoanInstallmentFormData {
  loanId: number;
  paymentId: number;
  date: string;
}

export interface MarkInstallmentAsMissedFormData {
  loanId: number;
  paymentId: number;
}

export interface ToggleSyncFormData {
  enabled: boolean;
}

export interface UpdateSettingFormData {
  key: string;
  value: string;
}