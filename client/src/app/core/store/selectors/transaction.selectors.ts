import { createSelector, createFeatureSelector } from '@ngrx/store';
import { TransactionState } from '../reducers/transaction.reducer';

export const selectTransactionsState = createFeatureSelector<TransactionState>('transactions');

export const selectAllTransactions = createSelector(
  selectTransactionsState,
  (state: TransactionState) => state.transactions
);

export const selectAccountTransactions = createSelector(
  selectTransactionsState,
  (state: TransactionState) => state.accountTransactions
);

export const selectAllScheduledPayments = createSelector(
  selectTransactionsState,
  (state: TransactionState) => state.scheduledPayments
);

export const selectTransactionsLoading = createSelector(
  selectTransactionsState,
  (state: TransactionState) => state.loading
);

export const selectTransactionsError = createSelector(
  selectTransactionsState,
  (state: TransactionState) => state.error
);

export const selectRecentTransactions = createSelector(
  selectAllTransactions,
  (transactions) => transactions.slice(0, 5)
);

export const selectScheduledPaymentsByAccountId = (accountId: number) => createSelector(
  selectAllScheduledPayments,
  (payments) => payments.filter(payment => payment.accountId === accountId)
);
