import { createReducer, on } from '@ngrx/store';
import { Loan, LoanPayment } from '../../models/loan.model';
import * as LoanActions from '../actions/loan.actions';

export interface LoanState {
  loans: Loan[];
  selectedLoan: Loan | null;
  loanPayments: LoanPayment[];
  loading: boolean;
  error: string | null;
}

export const initialState: LoanState = {
  loans: [],
  selectedLoan: null,
  loanPayments: [],
  loading: false,
  error: null
};

export const loanReducer = createReducer(
  initialState,
  // Load Loans
  on(LoanActions.loadLoans, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(LoanActions.loadLoansSuccess, (state, { loans }) => ({
    ...state,
    loans,
    loading: false
  })),
  on(LoanActions.loadLoansFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load Account Loans
  on(LoanActions.loadAccountLoans, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(LoanActions.loadAccountLoansSuccess, (state, { loans }) => ({
    ...state,
    loans,
    loading: false
  })),
  on(LoanActions.loadAccountLoansFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load Loan
  on(LoanActions.loadLoan, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(LoanActions.loadLoanSuccess, (state, { loan }) => ({
    ...state,
    selectedLoan: loan,
    loading: false
  })),
  on(LoanActions.loadLoanFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Apply for Loan
  on(LoanActions.applyForLoan, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(LoanActions.applyForLoanSuccess, (state, { loan }) => ({
    ...state,
    loans: [...state.loans, loan],
    selectedLoan: loan,
    loading: false
  })),
  on(LoanActions.applyForLoanFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load Loan Payments
  on(LoanActions.loadLoanPayments, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(LoanActions.loadLoanPaymentsSuccess, (state, { payments }) => ({
    ...state,
    loanPayments: payments,
    loading: false
  })),
  on(LoanActions.loadLoanPaymentsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Pay Loan Installment
  on(LoanActions.payLoanInstallment, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(LoanActions.payLoanInstallmentSuccess, (state, { payment }) => ({
    ...state,
    loanPayments: state.loanPayments.map(p => 
      p.id === payment.id ? payment : p
    ),
    loading: false
  })),
  on(LoanActions.payLoanInstallmentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Mark Installment as Missed
  on(LoanActions.markInstallmentAsMissed, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(LoanActions.markInstallmentAsMissedSuccess, (state, { payment }) => ({
    ...state,
    loanPayments: state.loanPayments.map(p => 
      p.id === payment.id ? payment : p
    ),
    loading: false
  })),
  on(LoanActions.markInstallmentAsMissedFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
