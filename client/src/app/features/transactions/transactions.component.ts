import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { AppState } from '../../core/store/app.state';
import { selectAllTransactions, selectTransactionsLoading } from '../../core/store/selectors/transaction.selectors';
import { selectAllAccounts } from '../../core/store/selectors/account.selectors';
import { loadTransactions } from '../../core/store/actions/transaction.actions';
import { loadAccounts } from '../../core/store/actions/account.actions';

import { Transaction } from '../../core/models/transaction.model';
import { Account } from '../../core/models/account.model';

import { DepositModalComponent } from './deposit-modal/deposit-modal.component';
import { WithdrawModalComponent } from './withdraw-modal/withdraw-modal.component';
import { TransferModalComponent } from './transfer-modal/transfer-modal.component';
import { ScheduleModalComponent } from './schedule-modal/schedule-modal.component';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html'
})
export class TransactionsComponent implements OnInit {
  transactions$: Observable<Transaction[]>;
  accounts$: Observable<Account[]>;
  loading$: Observable<boolean>;
  
  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog
  ) {
    this.transactions$ = this.store.select(selectAllTransactions);
    this.accounts$ = this.store.select(selectAllAccounts);
    this.loading$ = this.store.select(selectTransactionsLoading);
  }
  
  ngOnInit() {
    this.store.dispatch(loadTransactions());
    this.store.dispatch(loadAccounts());
  }
  
  openDepositModal() {
    this.dialog.open(DepositModalComponent, {
      width: '400px'
    });
  }
  
  openWithdrawModal() {
    this.dialog.open(WithdrawModalComponent, {
      width: '400px'
    });
  }
  
  openTransferModal() {
    this.dialog.open(TransferModalComponent, {
      width: '400px'
    });
  }
  
  openScheduleModal() {
    this.dialog.open(ScheduleModalComponent, {
      width: '400px'
    });
  }
}
