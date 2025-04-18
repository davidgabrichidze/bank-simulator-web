import { createAction, props } from '@ngrx/store';
import { Account, CreateAccountRequest } from '../../models/account.model';

// Load Accounts
export const loadAccounts = createAction(
  '[Account] Load Accounts'
);

export const loadAccountsSuccess = createAction(
  '[Account] Load Accounts Success',
  props<{ accounts: Account[] }>()
);

export const loadAccountsFailure = createAction(
  '[Account] Load Accounts Failure',
  props<{ error: string }>()
);

// Load Account
export const loadAccount = createAction(
  '[Account] Load Account',
  props<{ id: number }>()
);

export const loadAccountSuccess = createAction(
  '[Account] Load Account Success',
  props<{ account: Account }>()
);

export const loadAccountFailure = createAction(
  '[Account] Load Account Failure',
  props<{ error: string }>()
);

// Create Account
export const createAccount = createAction(
  '[Account] Create Account',
  props<{ account: CreateAccountRequest }>()
);

export const createAccountSuccess = createAction(
  '[Account] Create Account Success',
  props<{ account: Account }>()
);

export const createAccountFailure = createAction(
  '[Account] Create Account Failure',
  props<{ error: string }>()
);

// Close Account
export const closeAccount = createAction(
  '[Account] Close Account',
  props<{ id: number }>()
);

export const closeAccountSuccess = createAction(
  '[Account] Close Account Success',
  props<{ id: number }>()
);

export const closeAccountFailure = createAction(
  '[Account] Close Account Failure',
  props<{ error: string }>()
);
