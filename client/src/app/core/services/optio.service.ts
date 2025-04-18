import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OptioService {
  private apiUrl = `${environment.apiUrl}/optio`;

  constructor(private http: HttpClient) {}

  // Toggle Optio API sync on/off
  toggleSync(enabled: boolean): Observable<{ enabled: boolean }> {
    return this.http.post<{ enabled: boolean }>(`${this.apiUrl}/toggle-sync`, { enabled });
  }

  // Get sync status
  getSyncStatus(): Observable<{ enabled: boolean, lastSync: string | null }> {
    return this.http.get<{ enabled: boolean, lastSync: string | null }>(`${this.apiUrl}/status`);
  }
}
