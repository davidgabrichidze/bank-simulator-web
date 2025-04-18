import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AccountsComponent } from './features/accounts/accounts.component';
import { AccountDetailComponent } from './features/accounts/account-detail/account-detail.component';
import { AccountFormComponent } from './features/accounts/account-form/account-form.component';
import { TransactionsComponent } from './features/transactions/transactions.component';
import { LoansComponent } from './features/loans/loans.component';
import { LoanDetailComponent } from './features/loans/loan-detail/loan-detail.component';
import { LoanApplicationComponent } from './features/loans/loan-application/loan-application.component';
import { AdminComponent } from './features/admin/admin.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'accounts', component: AccountsComponent },
  { path: 'accounts/new', component: AccountFormComponent },
  { path: 'accounts/:id', component: AccountDetailComponent },
  { path: 'transactions', component: TransactionsComponent },
  { path: 'loans', component: LoansComponent },
  { path: 'loans/new', component: LoanApplicationComponent },
  { path: 'loans/:id', component: LoanDetailComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
