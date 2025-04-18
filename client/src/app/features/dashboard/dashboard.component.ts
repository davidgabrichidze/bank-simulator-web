import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { AppState } from '../../core/store/app.state';
import { selectAccountSummary } from '../../core/store/selectors/account.selectors';
import { selectRecentTransactions } from '../../core/store/selectors/transaction.selectors';
import { selectRecentEvents } from '../../core/store/selectors/event.selectors';
import { selectOptioSyncEnabled } from '../../core/store/selectors/settings.selectors';
import { Account, AccountSummary } from '../../core/models/account.model';
import { Transaction } from '../../core/models/transaction.model';
import { Event } from '../../core/models/event.model';

import { DepositModalComponent } from '../transactions/deposit-modal/deposit-modal.component';
import { WithdrawModalComponent } from '../transactions/withdraw-modal/withdraw-modal.component';
import { TransferModalComponent } from '../transactions/transfer-modal/transfer-modal.component';
import { ScheduleModalComponent } from '../transactions/schedule-modal/schedule-modal.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  accountSummary$: Observable<AccountSummary>;
  recentTransactions$: Observable<Transaction[]>;
  recentEvents$: Observable<Event[]>;
  optioSyncEnabled$: Observable<boolean>;
  
  selectedAccountIndex: number = 0;
  
  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog
  ) {
    this.accountSummary$ = this.store.select(selectAccountSummary);
    this.recentTransactions$ = this.store.select(selectRecentTransactions);
    this.recentEvents$ = this.store.select(selectRecentEvents);
    this.optioSyncEnabled$ = this.store.select(selectOptioSyncEnabled);
  }
  
  ngOnInit() {
    // Already loaded in AppComponent
  }
  
  openDepositModal() {
    this.dialog.open(DepositModalComponent, {
      width: '400px',
      panelClass: 'custom-dialog-container'
    });
  }
  
  openWithdrawModal() {
    this.dialog.open(WithdrawModalComponent, {
      width: '400px',
      panelClass: 'custom-dialog-container'
    });
  }
  
  openTransferModal() {
    this.dialog.open(TransferModalComponent, {
      width: '400px',
      panelClass: 'custom-dialog-container'
    });
  }
  
  openScheduleModal() {
    this.dialog.open(ScheduleModalComponent, {
      width: '400px',
      panelClass: 'custom-dialog-container'
    });
  }
  
  setActiveAccount(index: number) {
    this.selectedAccountIndex = index;
  }
}
