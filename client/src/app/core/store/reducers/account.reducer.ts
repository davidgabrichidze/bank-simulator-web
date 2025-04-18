import { createReducer, on } from '@ngrx/store';
import { Account } from '../../models/account.model';
import * as AccountActions from '../actions/account.actions';

export interface AccountState {
  accounts: Account[];
  selectedAccount: Account | null;
  loading: boolean;
  error: string | null;
}

export const initialState: AccountState = {
  accounts: [],
  selectedAccount: null,
  loading: false,
  error: null
};

export const accountReducer = createReducer(
  initialState,
  // Load Accounts
  on(AccountActions.loadAccounts, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AccountActions.loadAccountsSuccess, (state, { accounts }) => ({
    ...state,
    accounts,
    loading: false
  })),
  on(AccountActions.loadAccountsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load Account
  on(AccountActions.loadAccount, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AccountActions.loadAccountSuccess, (state, { account }) => ({
    ...state,
    selectedAccount: account,
    loading: false
  })),
  on(AccountActions.loadAccountFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Create Account
  on(AccountActions.createAccount, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AccountActions.createAccountSuccess, (state, { account }) => ({
    ...state,
    accounts: [...state.accounts, account],
    loading: false
  })),
  on(AccountActions.createAccountFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Close Account
  on(AccountActions.closeAccount, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AccountActions.closeAccountSuccess, (state, { id }) => ({
    ...state,
    accounts: state.accounts.map(account => 
      account.id === id ? { ...account, isActive: false } : account
    ),
    selectedAccount: state.selectedAccount && state.selectedAccount.id === id 
      ? { ...state.selectedAccount, isActive: false } 
      : state.selectedAccount,
    loading: false
  })),
  on(AccountActions.closeAccountFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
