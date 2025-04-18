import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AppState } from '../../../core/store/app.state';
import { createAccount } from '../../../core/store/actions/account.actions';
import { selectAccountsError, selectAccountsLoading } from '../../../core/store/selectors/account.selectors';
import { AccountType } from '../../../core/models/account.model';

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html'
})
export class AccountFormComponent implements OnInit {
  accountForm: FormGroup;
  loading$ = this.store.select(selectAccountsLoading);
  error$ = this.store.select(selectAccountsError);
  currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];
  accountTypes = Object.values(AccountType);

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.accountForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      type: [AccountType.PERSONAL, Validators.required],
      currency: ['USD', Validators.required],
      balance: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    this.error$.subscribe(error => {
      if (error) {
        this.snackBar.open(`Error: ${error}`, 'Close', {
          duration: 5000,
          panelClass: ['bg-error', 'text-white']
        });
      }
    });
  }

  onSubmit() {
    if (this.accountForm.valid) {
      this.store.dispatch(createAccount({ account: this.accountForm.value }));
      
      // Subscribe to loading to detect when the operation is complete
      const loadingSub = this.loading$.subscribe(loading => {
        if (!loading) {
          // Check if there's an error
          this.error$.subscribe(error => {
            if (!error) {
              this.snackBar.open('Account created successfully!', 'Close', {
                duration: 3000,
                panelClass: ['bg-success', 'text-white']
              });
              this.router.navigate(['/accounts']);
            }
            loadingSub.unsubscribe();
          });
        }
      });
    } else {
      this.accountForm.markAllAsTouched();
    }
  }
}
