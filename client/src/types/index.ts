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
  description?: string;
  status: 'completed' | 'pending' | 'failed';
  reference?: string;
  clientId?: number;
  channel?: string; // mobile, online, branch, atm, pos
  method?: string; // card, cash, transfer, check
  cardId?: number; // Reference to card if transaction was made with a card
  transactionDate: string;
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
  clientId?: number; // Customer who applied for the loan
  customerProductId?: number; // Link to product catalog
  amount: number;
  currency: string;
  interestRate: number;
  term: number; // In months
  startDate: string;
  purpose?: string; // Purpose of the loan
  collateral?: string; // Description of collateral if any
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed';
  creditScore?: number;
  approvalDate?: string;
  decisionNotes?: string;
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
  clientId?: number; // Customer associated with the event
  accountId?: number; // Account associated with the event
  transactionId?: number; // Transaction associated with the event
  loanId?: number; // Loan associated with the event
  cardId?: number; // Card associated with the event
  depositId?: number; // Deposit associated with the event
  customerProductId?: number; // Product associated with the event
  occurredAt: string;
  payload: string;
  channel?: string; // online, branch, atm, mobile, etc.
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
  clientId?: number;
  amount: number;
  description?: string;
  channel?: string; // mobile, online, branch, atm, pos
  method?: string; // card, cash, transfer, check
}

export interface WithdrawalFormData {
  accountId: number;
  clientId?: number;
  amount: number;
  description?: string;
  channel?: string; // mobile, online, branch, atm, pos
  method?: string; // card, cash, transfer, check
}

export interface TransferFormData {
  accountId: number;
  targetAccountId: number;
  clientId?: number;
  amount: number;
  description?: string;
  reference?: string;
  channel?: string; // mobile, online, branch, atm, pos
  method?: string; // card, cash, transfer, check
}

export interface ExternalTransferFormData {
  accountId: number;
  clientId?: number;
  beneficiaryName: string;
  beneficiaryAccount: string;
  bankCode: string;
  amount: number;
  description?: string;
  reference?: string;
  channel?: string; // mobile, online, branch, atm, pos
  method?: string; // card, cash, transfer, check
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
  clientId?: number;
  customerProductId?: number;
  amount: number;
  currency: string;
  interestRate: number;
  term: number;
  startDate: string;
  purpose?: string;
  collateral?: string;
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