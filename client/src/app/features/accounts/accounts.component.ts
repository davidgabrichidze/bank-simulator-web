import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { AppState } from '../../core/store/app.state';
import { selectAllAccounts, selectAccountsLoading } from '../../core/store/selectors/account.selectors';
import { loadAccounts, closeAccount } from '../../core/store/actions/account.actions';
import { Account } from '../../core/models/account.model';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html'
})
export class AccountsComponent implements OnInit {
  accounts$: Observable<Account[]>;
  loading$: Observable<boolean>;
  
  displayedColumns: string[] = ['accountNumber', 'name', 'type', 'balance', 'actions'];
  
  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog
  ) {
    this.accounts$ = this.store.select(selectAllAccounts);
    this.loading$ = this.store.select(selectAccountsLoading);
  }
  
  ngOnInit() {
    this.store.dispatch(loadAccounts());
  }
  
  closeAccount(id: number) {
    if (confirm('Are you sure you want to close this account?')) {
      this.store.dispatch(closeAccount({ id }));
    }
  }
  
  formatBalance(balance: number, currency: string): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(balance);
  }
}
