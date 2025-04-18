import { createSelector, createFeatureSelector } from '@ngrx/store';
import { LoanState } from '../reducers/loan.reducer';

export const selectLoansState = createFeatureSelector<LoanState>('loans');

export const selectAllLoans = createSelector(
  selectLoansState,
  (state: LoanState) => state.loans
);

export const selectLoanById = (id: number) => createSelector(
  selectAllLoans,
  (loans) => loans.find(loan => loan.id === id) || null
);

export const selectSelectedLoan = createSelector(
  selectLoansState,
  (state: LoanState) => state.selectedLoan
);

export const selectLoanPayments = createSelector(
  selectLoansState,
  (state: LoanState) => state.loanPayments
);

export const selectLoansLoading = createSelector(
  selectLoansState,
  (state: LoanState) => state.loading
);

export const selectLoansError = createSelector(
  selectLoansState,
  (state: LoanState) => state.error
);

export const selectLoansByAccountId = (accountId: number) => createSelector(
  selectAllLoans,
  (loans) => loans.filter(loan => loan.accountId === accountId)
);
