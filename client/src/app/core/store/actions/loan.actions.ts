import { createAction, props } from '@ngrx/store';
import { 
  Loan, 
  LoanApplication, 
  LoanPayment, 
  PayLoanInstallmentRequest, 
  MarkInstallmentAsMissedRequest 
} from '../../models/loan.model';

// Load Loans
export const loadLoans = createAction(
  '[Loan] Load Loans'
);

export const loadLoansSuccess = createAction(
  '[Loan] Load Loans Success',
  props<{ loans: Loan[] }>()
);

export const loadLoansFailure = createAction(
  '[Loan] Load Loans Failure',
  props<{ error: string }>()
);

// Load Account Loans
export const loadAccountLoans = createAction(
  '[Loan] Load Account Loans',
  props<{ accountId: number }>()
);

export const loadAccountLoansSuccess = createAction(
  '[Loan] Load Account Loans Success',
  props<{ loans: Loan[] }>()
);

export const loadAccountLoansFailure = createAction(
  '[Loan] Load Account Loans Failure',
  props<{ error: string }>()
);

// Load Loan
export const loadLoan = createAction(
  '[Loan] Load Loan',
  props<{ id: number }>()
);

export const loadLoanSuccess = createAction(
  '[Loan] Load Loan Success',
  props<{ loan: Loan }>()
);

export const loadLoanFailure = createAction(
  '[Loan] Load Loan Failure',
  props<{ error: string }>()
);

// Apply for Loan
export const applyForLoan = createAction(
  '[Loan] Apply For Loan',
  props<{ application: LoanApplication }>()
);

export const applyForLoanSuccess = createAction(
  '[Loan] Apply For Loan Success',
  props<{ loan: Loan }>()
);

export const applyForLoanFailure = createAction(
  '[Loan] Apply For Loan Failure',
  props<{ error: string }>()
);

// Load Loan Payments
export const loadLoanPayments = createAction(
  '[Loan] Load Loan Payments',
  props<{ loanId: number }>()
);

export const loadLoanPaymentsSuccess = createAction(
  '[Loan] Load Loan Payments Success',
  props<{ payments: LoanPayment[] }>()
);

export const loadLoanPaymentsFailure = createAction(
  '[Loan] Load Loan Payments Failure',
  props<{ error: string }>()
);

// Pay Loan Installment
export const payLoanInstallment = createAction(
  '[Loan] Pay Loan Installment',
  props<{ request: PayLoanInstallmentRequest }>()
);

export const payLoanInstallmentSuccess = createAction(
  '[Loan] Pay Loan Installment Success',
  props<{ payment: LoanPayment }>()
);

export const payLoanInstallmentFailure = createAction(
  '[Loan] Pay Loan Installment Failure',
  props<{ error: string }>()
);

// Mark Installment as Missed
export const markInstallmentAsMissed = createAction(
  '[Loan] Mark Installment as Missed',
  props<{ request: MarkInstallmentAsMissedRequest }>()
);

export const markInstallmentAsMissedSuccess = createAction(
  '[Loan] Mark Installment as Missed Success',
  props<{ payment: LoanPayment }>()
);

export const markInstallmentAsMissedFailure = createAction(
  '[Loan] Mark Installment as Missed Failure',
  props<{ error: string }>()
);
