import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { AppState } from '../../core/store/app.state';
import { selectAllLoans, selectLoansLoading } from '../../core/store/selectors/loan.selectors';
import { loadLoans } from '../../core/store/actions/loan.actions';
import { Loan, LoanStatus } from '../../core/models/loan.model';

@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html'
})
export class LoansComponent implements OnInit {
  loans$: Observable<Loan[]>;
  loading$: Observable<boolean>;
  
  displayedColumns: string[] = ['id', 'accountId', 'amount', 'interestRate', 'term', 'status', 'actions'];
  LoanStatus = LoanStatus;
  
  constructor(
    private store: Store<AppState>,
    private router: Router
  ) {
    this.loans$ = this.store.select(selectAllLoans);
    this.loading$ = this.store.select(selectLoansLoading);
  }
  
  ngOnInit() {
    this.store.dispatch(loadLoans());
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
  
  applyForLoan() {
    this.router.navigate(['/loans/new']);
  }
  
  viewLoanDetails(id: number) {
    this.router.navigate(['/loans', id]);
  }
}
