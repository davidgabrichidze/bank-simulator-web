import { AccountState } from './reducers/account.reducer';
import { TransactionState } from './reducers/transaction.reducer';
import { LoanState } from './reducers/loan.reducer';
import { EventState } from './reducers/event.reducer';
import { SettingsState } from './reducers/settings.reducer';

export interface AppState {
  accounts: AccountState;
  transactions: TransactionState;
  loans: LoanState;
  events: EventState;
  settings: SettingsState;
}
