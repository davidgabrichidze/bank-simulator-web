import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private apiUrl = `${environment.apiUrl}/settings`;

  constructor(private http: HttpClient) {}

  getSettings(): Observable<{ [key: string]: string }> {
    return this.http.get<{ [key: string]: string }>(this.apiUrl);
  }

  updateSetting(key: string, value: string): Observable<{ key: string, value: string }> {
    return this.http.post<{ key: string, value: string }>(this.apiUrl, { key, value });
  }

  resetDatabase(): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.apiUrl}/reset`, {});
  }
}
