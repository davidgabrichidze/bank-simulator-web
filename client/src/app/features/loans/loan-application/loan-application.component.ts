import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AppState } from '../../../core/store/app.state';
import { selectAllAccounts } from '../../../core/store/selectors/account.selectors';
import { selectLoansLoading, selectLoansError } from '../../../core/store/selectors/loan.selectors';
import { loadAccounts } from '../../../core/store/actions/account.actions';
import { applyForLoan } from '../../../core/store/actions/loan.actions';
import { Account } from '../../../core/models/account.model';

@Component({
  selector: 'app-loan-application',
  templateUrl: './loan-application.component.html'
})
export class LoanApplicationComponent implements OnInit {
  loanForm: FormGroup;
  accounts$: Observable<Account[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  
  currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];
  termOptions = [6, 12, 24, 36, 48, 60];
  
  // Calculate loan payment info
  monthlyPayment: number = 0;
  totalPayment: number = 0;
  totalInterest: number = 0;
  
  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.accounts$ = this.store.select(selectAllAccounts);
    this.loading$ = this.store.select(selectLoansLoading);
    this.error$ = this.store.select(selectLoansError);
    
    this.loanForm = this.fb.group({
      accountId: ['', Validators.required],
      amount: [1000, [Validators.required, Validators.min(100)]],
      currency: ['USD', Validators.required],
      interestRate: [5.5, [Validators.required, Validators.min(0.1), Validators.max(30)]],
      term: [12, Validators.required],
      startDate: [new Date(), Validators.required]
    });
  }
  
  ngOnInit() {
    this.store.dispatch(loadAccounts());
    
    // Subscribe to form value changes to update payment calculation
    this.loanForm.valueChanges.subscribe(() => {
      this.calculateLoanPayments();
    });
    
    // Initial calculation
    this.calculateLoanPayments();
    
    // Handle errors
    this.error$.subscribe(error => {
      if (error) {
        this.snackBar.open(`Error: ${error}`, 'Close', {
          duration: 5000,
          panelClass: ['bg-error', 'text-white']
        });
      }
    });
  }
  
  calculateLoanPayments() {
    const amount = this.loanForm.get('amount')?.value || 0;
    const interestRate = this.loanForm.get('interestRate')?.value || 0;
    const term = this.loanForm.get('term')?.value || 0;
    
    if (amount > 0 && interestRate > 0 && term > 0) {
      const monthlyRate = interestRate / 100 / 12;
      const totalPayments = term;
      
      // Calculate monthly payment using loan formula
      this.monthlyPayment = amount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments) / 
                          (Math.pow(1 + monthlyRate, totalPayments) - 1);
      
      this.totalPayment = this.monthlyPayment * totalPayments;
      this.totalInterest = this.totalPayment - amount;
    } else {
      this.monthlyPayment = 0;
      this.totalPayment = 0;
      this.totalInterest = 0;
    }
  }
  
  onSubmit() {
    if (this.loanForm.valid) {
      // Format dates for API
      const formData = {...this.loanForm.value};
      formData.startDate = new Date(formData.startDate).toISOString();
      
      this.store.dispatch(applyForLoan({ application: formData }));
      
      // Subscribe to loading to detect when operation is complete
      const loadingSub = this.loading$.subscribe(loading => {
        if (!loading) {
          // Check if there's an error
          this.error$.subscribe(error => {
            if (!error) {
              this.snackBar.open('Loan application submitted successfully!', 'Close', {
                duration: 3000,
                panelClass: ['bg-success', 'text-white']
              });
              this.router.navigate(['/loans']);
            }
            loadingSub.unsubscribe();
          });
        }
      });
    } else {
      this.loanForm.markAllAsTouched();
    }
  }
  
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: this.loanForm.get('currency')?.value || 'USD' 
    }).format(value);
  }
}
