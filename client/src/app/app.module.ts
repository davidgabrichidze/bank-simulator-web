import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

// Core store
import { reducers, metaReducers } from './core/store/reducers';
import { AccountEffects } from './core/store/effects/account.effects';
import { TransactionEffects } from './core/store/effects/transaction.effects';
import { LoanEffects } from './core/store/effects/loan.effects';
import { EventEffects } from './core/store/effects/event.effects';
import { SettingsEffects } from './core/store/effects/settings.effects';

// Shared Components
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { TransactionTableComponent } from './shared/components/transaction-table/transaction-table.component';
import { EventFeedComponent } from './shared/components/event-feed/event-feed.component';

// Feature Components
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AccountsComponent } from './features/accounts/accounts.component';
import { AccountFormComponent } from './features/accounts/account-form/account-form.component';
import { AccountDetailComponent } from './features/accounts/account-detail/account-detail.component';
import { TransactionsComponent } from './features/transactions/transactions.component';
import { DepositModalComponent } from './features/transactions/deposit-modal/deposit-modal.component';
import { WithdrawModalComponent } from './features/transactions/withdraw-modal/withdraw-modal.component';
import { TransferModalComponent } from './features/transactions/transfer-modal/transfer-modal.component';
import { ScheduleModalComponent } from './features/transactions/schedule-modal/schedule-modal.component';
import { LoansComponent } from './features/loans/loans.component';
import { LoanApplicationComponent } from './features/loans/loan-application/loan-application.component';
import { LoanDetailComponent } from './features/loans/loan-detail/loan-detail.component';
import { AdminComponent } from './features/admin/admin.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HeaderComponent,
    TransactionTableComponent,
    EventFeedComponent,
    DashboardComponent,
    AccountsComponent,
    AccountFormComponent,
    AccountDetailComponent,
    TransactionsComponent,
    DepositModalComponent,
    WithdrawModalComponent,
    TransferModalComponent,
    ScheduleModalComponent,
    LoansComponent,
    LoanApplicationComponent,
    LoanDetailComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    // Angular Material
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    // NgRx
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([
      AccountEffects,
      TransactionEffects,
      LoanEffects,
      EventEffects,
      SettingsEffects
    ]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
      autoPause: true,
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
