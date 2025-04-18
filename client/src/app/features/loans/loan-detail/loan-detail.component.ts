import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AppState } from '../../../core/store/app.state';
import { loadLoan, loadLoanPayments, payLoanInstallment, markInstallmentAsMissed } from '../../../core/store/actions/loan.actions';
import { selectSelectedLoan, selectLoanPayments, selectLoansLoading } from '../../../core/store/selectors/loan.selectors';
import { Loan, LoanStatus, LoanPayment } from '../../../core/models/loan.model';

@Component({
  selector: 'app-loan-detail',
  templateUrl: './loan-detail.component.html'
})
export class LoanDetailComponent implements OnInit {
  loanId: number = 0;
  loan$: Observable<Loan | null>;
  payments$: Observable<LoanPayment[]>;
  loading$: Observable<boolean>;
  
  displayedColumns: string[] = ['paymentNumber', 'dueDate', 'amount', 'status', 'actions'];
  LoanStatus = LoanStatus;
  
  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private snackBar: MatSnackBar
  ) {
    this.loan$ = this.store.select(selectSelectedLoan);
    this.payments$ = this.store.select(selectLoanPayments);
    this.loading$ = this.store.select(selectLoansLoading);
  }
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.loanId = +params['id'];
      this.store.dispatch(loadLoan({ id: this.loanId }));
      this.store.dispatch(loadLoanPayments({ loanId: this.loanId }));
    });
  }
  
  getStatusClass(status: LoanStatus): string {
    switch (status) {
      case LoanStatus.APPROVED:
      case LoanStatus.COMPLETED:
        return 'bg-success/10 text-success';
      case LoanStatus.REJECTED:
        return 'bg-error/10 text-error';
      case LoanStatus.PENDING:
        return 'bg-warning/10 text-warning';
      case LoanStatus.ACTIVE:
        return 'bg-primary/10 text-primary';
      default:
        return 'bg-neutral-200 text-neutral-700';
    }
  }
  
  formatAmount(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(amount);
  }
  
  payInstallment(loanId: number, paymentId: number) {
    this.store.dispatch(payLoanInstallment({ 
      request: { 
        loanId, 
        paymentId, 
        date: new Date().toISOString() 
      } 
    }));
    
    // Subscribe to loading to detect when operation is complete
    const loadingSub = this.loading$.subscribe(loading => {
      if (!loading) {
        this.snackBar.open('Payment successful!', 'Close', {
          duration: 3000,
          panelClass: ['bg-success', 'text-white']
        });
        loadingSub.unsubscribe();
      }
    });
  }
  
  markAsMissed(loanId: number, paymentId: number) {
    this.store.dispatch(markInstallmentAsMissed({ 
      request: { 
        loanId, 
        paymentId 
      } 
    }));
    
    // Subscribe to loading to detect when operation is complete
    const loadingSub = this.loading$.subscribe(loading => {
      if (!loading) {
        this.snackBar.open('Payment marked as missed', 'Close', {
          duration: 3000,
          panelClass: ['bg-error', 'text-white']
        });
        loadingSub.unsubscribe();
      }
    });
  }
  
  isPaymentUpcoming(dueDate: string): boolean {
    const now = new Date();
    const paymentDate = new Date(dueDate);
    return paymentDate > now;
  }
  
  isPaymentDue(dueDate: string): boolean {
    const now = new Date();
    const paymentDate = new Date(dueDate);
    return paymentDate <= now;
  }
}
