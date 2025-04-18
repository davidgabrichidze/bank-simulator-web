import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AppState } from '../../../core/store/app.state';
import { loadAccount, closeAccount } from '../../../core/store/actions/account.actions';
import { loadAccountTransactions } from '../../../core/store/actions/transaction.actions';
import { selectAccountById, selectAccountsLoading } from '../../../core/store/selectors/account.selectors';
import { selectAccountTransactions } from '../../../core/store/selectors/transaction.selectors';
import { Account } from '../../../core/models/account.model';
import { Transaction } from '../../../core/models/transaction.model';

import { DepositModalComponent } from '../../transactions/deposit-modal/deposit-modal.component';
import { WithdrawModalComponent } from '../../transactions/withdraw-modal/withdraw-modal.component';
import { TransferModalComponent } from '../../transactions/transfer-modal/transfer-modal.component';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html'
})
export class AccountDetailComponent implements OnInit {
  accountId: number = 0;
  account$: Observable<Account | null>;
  transactions$: Observable<Transaction[]>;
  loading$: Observable<boolean>;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.loading$ = this.store.select(selectAccountsLoading);
    this.account$ = this.store.select(selectAccountById(0)); // Will be updated in ngOnInit
    this.transactions$ = this.store.select(selectAccountTransactions);
  }
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.accountId = +params['id'];
      this.account$ = this.store.select(selectAccountById(this.accountId));
      this.store.dispatch(loadAccount({ id: this.accountId }));
      this.store.dispatch(loadAccountTransactions({ accountId: this.accountId }));
    });
  }
  
  closeAccount(id: number) {
    if (confirm('Are you sure you want to close this account?')) {
      this.store.dispatch(closeAccount({ id }));
      
      // Subscribe to loading to detect when the operation is complete
      const loadingSub = this.loading$.subscribe(loading => {
        if (!loading) {
          this.snackBar.open('Account closed successfully!', 'Close', {
            duration: 3000,
            panelClass: ['bg-success', 'text-white']
          });
          this.router.navigate(['/accounts']);
          loadingSub.unsubscribe();
        }
      });
    }
  }
  
  openDepositModal() {
    this.dialog.open(DepositModalComponent, {
      width: '400px',
      data: { accountId: this.accountId }
    });
  }
  
  openWithdrawModal() {
    this.dialog.open(WithdrawModalComponent, {
      width: '400px',
      data: { accountId: this.accountId }
    });
  }
  
  openTransferModal() {
    this.dialog.open(TransferModalComponent, {
      width: '400px',
      data: { sourceAccountId: this.accountId }
    });
  }
  
  formatBalance(balance: number, currency: string): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(balance);
  }
}
