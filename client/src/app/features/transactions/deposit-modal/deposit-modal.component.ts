import { Component, OnInit, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AppState } from '../../../core/store/app.state';
import { selectAllAccounts } from '../../../core/store/selectors/account.selectors';
import { selectTransactionsLoading } from '../../../core/store/selectors/transaction.selectors';
import { deposit } from '../../../core/store/actions/transaction.actions';
import { loadAccounts } from '../../../core/store/actions/account.actions';
import { Account } from '../../../core/models/account.model';

@Component({
  selector: 'app-deposit-modal',
  templateUrl: './deposit-modal.component.html'
})
export class DepositModalComponent implements OnInit {
  depositForm: FormGroup;
  accounts$: Observable<Account[]>;
  loading$: Observable<boolean>;
  
  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private dialogRef: MatDialogRef<DepositModalComponent>,
    private snackBar: MatSnackBar,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { accountId?: number }
  ) {
    this.accounts$ = this.store.select(selectAllAccounts);
    this.loading$ = this.store.select(selectTransactionsLoading);
    
    this.depositForm = this.fb.group({
      accountId: [data?.accountId || '', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      currency: ['USD', Validators.required],
      description: ['']
    });
  }
  
  ngOnInit() {
    this.store.dispatch(loadAccounts());
  }
  
  onSubmit() {
    if (this.depositForm.valid) {
      this.store.dispatch(deposit({ request: this.depositForm.value }));
      
      // Subscribe to loading to detect when operation is complete
      const loadingSub = this.loading$.subscribe(loading => {
        if (!loading) {
          this.snackBar.open('Deposit successful!', 'Close', {
            duration: 3000,
            panelClass: ['bg-success', 'text-white']
          });
          this.dialogRef.close();
          loadingSub.unsubscribe();
        }
      });
    } else {
      this.depositForm.markAllAsTouched();
    }
  }
  
  onCancel() {
    this.dialogRef.close();
  }
}
