import { Component, OnInit, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AppState } from '../../../core/store/app.state';
import { selectAllAccounts } from '../../../core/store/selectors/account.selectors';
import { selectTransactionsLoading } from '../../../core/store/selectors/transaction.selectors';
import { transfer } from '../../../core/store/actions/transaction.actions';
import { loadAccounts } from '../../../core/store/actions/account.actions';
import { Account } from '../../../core/models/account.model';

@Component({
  selector: 'app-transfer-modal',
  templateUrl: './transfer-modal.component.html'
})
export class TransferModalComponent implements OnInit {
  transferForm: FormGroup;
  accounts$: Observable<Account[]>;
  loading$: Observable<boolean>;
  
  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private dialogRef: MatDialogRef<TransferModalComponent>,
    private snackBar: MatSnackBar,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { sourceAccountId?: number }
  ) {
    this.accounts$ = this.store.select(selectAllAccounts);
    this.loading$ = this.store.select(selectTransactionsLoading);
    
    this.transferForm = this.fb.group({
      sourceAccountId: [data?.sourceAccountId || '', Validators.required],
      targetAccountId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      currency: ['USD', Validators.required],
      description: ['']
    });
  }
  
  ngOnInit() {
    this.store.dispatch(loadAccounts());
  }
  
  onSubmit() {
    if (this.transferForm.valid) {
      const sourceId = this.transferForm.get('sourceAccountId')?.value;
      const targetId = this.transferForm.get('targetAccountId')?.value;
      
      if (sourceId === targetId) {
        this.snackBar.open('Source and target accounts cannot be the same', 'Close', {
          duration: 5000,
          panelClass: ['bg-error', 'text-white']
        });
        return;
      }
      
      this.store.dispatch(transfer({ request: this.transferForm.value }));
      
      // Subscribe to loading to detect when operation is complete
      const loadingSub = this.loading$.subscribe(loading => {
        if (!loading) {
          this.snackBar.open('Transfer successful!', 'Close', {
            duration: 3000,
            panelClass: ['bg-success', 'text-white']
          });
          this.dialogRef.close();
          loadingSub.unsubscribe();
        }
      });
    } else {
      this.transferForm.markAllAsTouched();
    }
  }
  
  onCancel() {
    this.dialogRef.close();
  }
  
  isOtherAccount(currentAccountId: number): (account: Account) => boolean {
    return (account: Account) => {
      return account.id !== currentAccountId && account.isActive;
    };
  }
}
