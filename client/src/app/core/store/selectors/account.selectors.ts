import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AccountState } from '../reducers/account.reducer';
import { AccountType } from '../../models/account.model';

export const selectAccountsState = createFeatureSelector<AccountState>('accounts');

export const selectAllAccounts = createSelector(
  selectAccountsState,
  (state: AccountState) => state.accounts
);

export const selectActiveAccounts = createSelector(
  selectAllAccounts,
  (accounts) => accounts.filter(account => account.isActive)
);

export const selectAccountById = (id: number) => createSelector(
  selectAllAccounts,
  (accounts) => accounts.find(account => account.id === id) || null
);

export const selectSelectedAccount = createSelector(
  selectAccountsState,
  (state: AccountState) => state.selectedAccount
);

export const selectAccountsLoading = createSelector(
  selectAccountsState,
  (state: AccountState) => state.loading
);

export const selectAccountsError = createSelector(
  selectAccountsState,
  (state: AccountState) => state.error
);

export const selectAccountSummary = createSelector(
  selectActiveAccounts,
  (accounts) => {
    const personal = accounts.filter(a => a.type === AccountType.PERSONAL).length;
    const business = accounts.filter(a => a.type === AccountType.BUSINESS).length;
    
    return {
      personal,
      business,
      total: personal + business
    };
  }
);
