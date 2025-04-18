import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AppState } from '../../../core/store/app.state';
import { selectAllAccounts } from '../../../core/store/selectors/account.selectors';
import { selectTransactionsLoading } from '../../../core/store/selectors/transaction.selectors';
import { createScheduledPayment } from '../../../core/store/actions/transaction.actions';
import { loadAccounts } from '../../../core/store/actions/account.actions';
import { Account } from '../../../core/models/account.model';
import { PaymentFrequency } from '../../../core/models/transaction.model';

@Component({
  selector: 'app-schedule-modal',
  templateUrl: './schedule-modal.component.html'
})
export class ScheduleModalComponent implements OnInit {
  scheduleForm: FormGroup;
  accounts$: Observable<Account[]>;
  loading$: Observable<boolean>;
  
  frequencyOptions = [
    { value: PaymentFrequency.ONE_OFF, label: 'One-off' },
    { value: PaymentFrequency.WEEKLY, label: 'Weekly' },
    { value: PaymentFrequency.MONTHLY, label: 'Monthly' }
  ];
  
  showEndDate: boolean = false;
  
  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private dialogRef: MatDialogRef<ScheduleModalComponent>,
    private snackBar: MatSnackBar
  ) {
    this.accounts$ = this.store.select(selectAllAccounts);
    this.loading$ = this.store.select(selectTransactionsLoading);
    
    this.scheduleForm = this.fb.group({
      accountId: ['', Validators.required],
      targetAccountId: [''],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      currency: ['USD', Validators.required],
      description: [''],
      frequency: [PaymentFrequency.ONE_OFF, Validators.required],
      nextPaymentDate: ['', Validators.required],
      endDate: ['']
    });
  }
  
  ngOnInit() {
    this.store.dispatch(loadAccounts());
    
    // Subscribe to frequency changes
    this.scheduleForm.get('frequency')?.valueChanges.subscribe(frequency => {
      this.showEndDate = frequency !== PaymentFrequency.ONE_OFF;
      
      if (this.showEndDate) {
        this.scheduleForm.get('endDate')?.setValidators(Validators.required);
      } else {
        this.scheduleForm.get('endDate')?.clearValidators();
        this.scheduleForm.get('endDate')?.setValue('');
      }
      
      this.scheduleForm.get('endDate')?.updateValueAndValidity();
    });
  }
  
  onSubmit() {
    if (this.scheduleForm.valid) {
      // Format dates for API
      const formData = {...this.scheduleForm.value};
      formData.nextPaymentDate = new Date(formData.nextPaymentDate).toISOString();
      
      if (formData.endDate) {
        formData.endDate = new Date(formData.endDate).toISOString();
      }
      
      this.store.dispatch(createScheduledPayment({ request: formData }));
      
      // Subscribe to loading to detect when operation is complete
      const loadingSub = this.loading$.subscribe(loading => {
        if (!loading) {
          this.snackBar.open('Payment scheduled successfully!', 'Close', {
            duration: 3000,
            panelClass: ['bg-success', 'text-white']
          });
          this.dialogRef.close();
          loadingSub.unsubscribe();
        }
      });
    } else {
      this.scheduleForm.markAllAsTouched();
    }
  }
  
  onCancel() {
    this.dialogRef.close();
  }
}
