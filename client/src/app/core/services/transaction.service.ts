import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  Transaction, 
  DepositRequest, 
  WithdrawalRequest, 
  TransferRequest, 
  ExternalTransferRequest,
  ScheduledPayment,
  ScheduledPaymentRequest
} from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = `${environment.apiUrl}/transactions`;
  private scheduledPaymentsUrl = `${environment.apiUrl}/scheduled-payments`;

  constructor(private http: HttpClient) {}

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl);
  }

  getAccountTransactions(accountId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/account/${accountId}`);
  }

  deposit(request: DepositRequest): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/deposit`, request);
  }

  withdraw(request: WithdrawalRequest): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/withdraw`, request);
  }

  transfer(request: TransferRequest): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/transfer`, request);
  }

  externalTransfer(request: ExternalTransferRequest): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/external-transfer`, request);
  }

  // Scheduled Payments
  getScheduledPayments(): Observable<ScheduledPayment[]> {
    return this.http.get<ScheduledPayment[]>(this.scheduledPaymentsUrl);
  }

  getAccountScheduledPayments(accountId: number): Observable<ScheduledPayment[]> {
    return this.http.get<ScheduledPayment[]>(`${this.scheduledPaymentsUrl}/account/${accountId}`);
  }

  createScheduledPayment(request: ScheduledPaymentRequest): Observable<ScheduledPayment> {
    return this.http.post<ScheduledPayment>(this.scheduledPaymentsUrl, request);
  }

  cancelScheduledPayment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.scheduledPaymentsUrl}/${id}`);
  }
}
