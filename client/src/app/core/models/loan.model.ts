export interface Loan {
  id: number;
  accountId: number;
  amount: number;
  currency: string;
  interestRate: number;
  term: number; // in months
  startDate: string;
  status: LoanStatus;
  creditScore?: number;
  createdAt: string;
  payments?: LoanPayment[];
}

export enum LoanStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ACTIVE = 'active',
  COMPLETED = 'completed'
}

export interface LoanApplication {
  accountId: number;
  amount: number;
  currency: string;
  interestRate: number;
  term: number;
  startDate: string;
}

export interface LoanPayment {
  id: number;
  loanId: number;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  paymentDate?: string;
  createdAt: string;
}

export interface PayLoanInstallmentRequest {
  loanId: number;
  paymentId: number;
  date: string;
}

export interface MarkInstallmentAsMissedRequest {
  loanId: number;
  paymentId: number;
}
