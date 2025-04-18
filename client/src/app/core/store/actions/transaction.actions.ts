import { createAction, props } from '@ngrx/store';
import { 
  Transaction, 
  DepositRequest, 
  WithdrawalRequest, 
  TransferRequest, 
  ExternalTransferRequest,
  ScheduledPayment,
  ScheduledPaymentRequest
} from '../../models/transaction.model';

// Load Transactions
export const loadTransactions = createAction(
  '[Transaction] Load Transactions'
);

export const loadTransactionsSuccess = createAction(
  '[Transaction] Load Transactions Success',
  props<{ transactions: Transaction[] }>()
);

export const loadTransactionsFailure = createAction(
  '[Transaction] Load Transactions Failure',
  props<{ error: string }>()
);

// Load Account Transactions
export const loadAccountTransactions = createAction(
  '[Transaction] Load Account Transactions',
  props<{ accountId: number }>()
);

export const loadAccountTransactionsSuccess = createAction(
  '[Transaction] Load Account Transactions Success',
  props<{ transactions: Transaction[] }>()
);

export const loadAccountTransactionsFailure = createAction(
  '[Transaction] Load Account Transactions Failure',
  props<{ error: string }>()
);

// Deposit
export const deposit = createAction(
  '[Transaction] Deposit',
  props<{ request: DepositRequest }>()
);

export const depositSuccess = createAction(
  '[Transaction] Deposit Success',
  props<{ transaction: Transaction }>()
);

export const depositFailure = createAction(
  '[Transaction] Deposit Failure',
  props<{ error: string }>()
);

// Withdraw
export const withdraw = createAction(
  '[Transaction] Withdraw',
  props<{ request: WithdrawalRequest }>()
);

export const withdrawSuccess = createAction(
  '[Transaction] Withdraw Success',
  props<{ transaction: Transaction }>()
);

export const withdrawFailure = createAction(
  '[Transaction] Withdraw Failure',
  props<{ error: string }>()
);

// Transfer
export const transfer = createAction(
  '[Transaction] Transfer',
  props<{ request: TransferRequest }>()
);

export const transferSuccess = createAction(
  '[Transaction] Transfer Success',
  props<{ transaction: Transaction }>()
);

export const transferFailure = createAction(
  '[Transaction] Transfer Failure',
  props<{ error: string }>()
);

// External Transfer
export const externalTransfer = createAction(
  '[Transaction] External Transfer',
  props<{ request: ExternalTransferRequest }>()
);

export const externalTransferSuccess = createAction(
  '[Transaction] External Transfer Success',
  props<{ transaction: Transaction }>()
);

export const externalTransferFailure = createAction(
  '[Transaction] External Transfer Failure',
  props<{ error: string }>()
);

// Scheduled Payments
export const loadScheduledPayments = createAction(
  '[Transaction] Load Scheduled Payments'
);

export const loadScheduledPaymentsSuccess = createAction(
  '[Transaction] Load Scheduled Payments Success',
  props<{ payments: ScheduledPayment[] }>()
);

export const loadScheduledPaymentsFailure = createAction(
  '[Transaction] Load Scheduled Payments Failure',
  props<{ error: string }>()
);

export const createScheduledPayment = createAction(
  '[Transaction] Create Scheduled Payment',
  props<{ request: ScheduledPaymentRequest }>()
);

export const createScheduledPaymentSuccess = createAction(
  '[Transaction] Create Scheduled Payment Success',
  props<{ payment: ScheduledPayment }>()
);

export const createScheduledPaymentFailure = createAction(
  '[Transaction] Create Scheduled Payment Failure',
  props<{ error: string }>()
);

export const cancelScheduledPayment = createAction(
  '[Transaction] Cancel Scheduled Payment',
  props<{ id: number }>()
);

export const cancelScheduledPaymentSuccess = createAction(
  '[Transaction] Cancel Scheduled Payment Success',
  props<{ id: number }>()
);

export const cancelScheduledPaymentFailure = createAction(
  '[Transaction] Cancel Scheduled Payment Failure',
  props<{ error: string }>()
);
