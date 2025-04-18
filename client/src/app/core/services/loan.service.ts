import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  Loan, 
  LoanApplication, 
  LoanPayment, 
  PayLoanInstallmentRequest, 
  MarkInstallmentAsMissedRequest 
} from '../models/loan.model';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private apiUrl = `${environment.apiUrl}/loans`;

  constructor(private http: HttpClient) {}

  getLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(this.apiUrl);
  }

  getAccountLoans(accountId: number): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.apiUrl}/account/${accountId}`);
  }

  getLoan(id: number): Observable<Loan> {
    return this.http.get<Loan>(`${this.apiUrl}/${id}`);
  }

  applyForLoan(application: LoanApplication): Observable<Loan> {
    return this.http.post<Loan>(this.apiUrl, application);
  }

  getLoanPayments(loanId: number): Observable<LoanPayment[]> {
    return this.http.get<LoanPayment[]>(`${this.apiUrl}/${loanId}/payments`);
  }

  payLoanInstallment(request: PayLoanInstallmentRequest): Observable<LoanPayment> {
    return this.http.post<LoanPayment>(`${this.apiUrl}/payments/pay`, request);
  }

  markInstallmentAsMissed(request: MarkInstallmentAsMissedRequest): Observable<LoanPayment> {
    return this.http.post<LoanPayment>(`${this.apiUrl}/payments/miss`, request);
  }
}
