import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../../../environments/environment';
import { AppState } from '../app.state';
import { accountReducer } from './account.reducer';
import { transactionReducer } from './transaction.reducer';
import { loanReducer } from './loan.reducer';
import { eventReducer } from './event.reducer';
import { settingsReducer } from './settings.reducer';

export const reducers: ActionReducerMap<AppState> = {
  accounts: accountReducer,
  transactions: transactionReducer,
  loans: loanReducer,
  events: eventReducer,
  settings: settingsReducer
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
