import { createReducer, on } from '@ngrx/store';
import { Transaction, ScheduledPayment } from '../../models/transaction.model';
import * as TransactionActions from '../actions/transaction.actions';

export interface TransactionState {
  transactions: Transaction[];
  accountTransactions: Transaction[];
  scheduledPayments: ScheduledPayment[];
  loading: boolean;
  error: string | null;
}

export const initialState: TransactionState = {
  transactions: [],
  accountTransactions: [],
  scheduledPayments: [],
  loading: false,
  error: null
};

export const transactionReducer = createReducer(
  initialState,
  // Load Transactions
  on(TransactionActions.loadTransactions, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TransactionActions.loadTransactionsSuccess, (state, { transactions }) => ({
    ...state,
    transactions,
    loading: false
  })),
  on(TransactionActions.loadTransactionsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load Account Transactions
  on(TransactionActions.loadAccountTransactions, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TransactionActions.loadAccountTransactionsSuccess, (state, { transactions }) => ({
    ...state,
    accountTransactions: transactions,
    loading: false
  })),
  on(TransactionActions.loadAccountTransactionsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Deposit
  on(TransactionActions.deposit, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TransactionActions.depositSuccess, (state, { transaction }) => ({
    ...state,
    transactions: [transaction, ...state.transactions],
    accountTransactions: transaction.accountId === (state.accountTransactions[0]?.accountId || 0)
      ? [transaction, ...state.accountTransactions]
      : state.accountTransactions,
    loading: false
  })),
  on(TransactionActions.depositFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Withdraw
  on(TransactionActions.withdraw, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TransactionActions.withdrawSuccess, (state, { transaction }) => ({
    ...state,
    transactions: [transaction, ...state.transactions],
    accountTransactions: transaction.accountId === (state.accountTransactions[0]?.accountId || 0)
      ? [transaction, ...state.accountTransactions]
      : state.accountTransactions,
    loading: false
  })),
  on(TransactionActions.withdrawFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Transfer
  on(TransactionActions.transfer, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TransactionActions.transferSuccess, (state, { transaction }) => ({
    ...state,
    transactions: [transaction, ...state.transactions],
    accountTransactions: transaction.accountId === (state.accountTransactions[0]?.accountId || 0)
      ? [transaction, ...state.accountTransactions]
      : state.accountTransactions,
    loading: false
  })),
  on(TransactionActions.transferFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // External Transfer
  on(TransactionActions.externalTransfer, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TransactionActions.externalTransferSuccess, (state, { transaction }) => ({
    ...state,
    transactions: [transaction, ...state.transactions],
    accountTransactions: transaction.accountId === (state.accountTransactions[0]?.accountId || 0)
      ? [transaction, ...state.accountTransactions]
      : state.accountTransactions,
    loading: false
  })),
  on(TransactionActions.externalTransferFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Scheduled Payments
  on(TransactionActions.loadScheduledPayments, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TransactionActions.loadScheduledPaymentsSuccess, (state, { payments }) => ({
    ...state,
    scheduledPayments: payments,
    loading: false
  })),
  on(TransactionActions.loadScheduledPaymentsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(TransactionActions.createScheduledPayment, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TransactionActions.createScheduledPaymentSuccess, (state, { payment }) => ({
    ...state,
    scheduledPayments: [payment, ...state.scheduledPayments],
    loading: false
  })),
  on(TransactionActions.createScheduledPaymentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(TransactionActions.cancelScheduledPayment, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TransactionActions.cancelScheduledPaymentSuccess, (state, { id }) => ({
    ...state,
    scheduledPayments: state.scheduledPayments.filter(payment => payment.id !== id),
    loading: false
  })),
  on(TransactionActions.cancelScheduledPaymentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
