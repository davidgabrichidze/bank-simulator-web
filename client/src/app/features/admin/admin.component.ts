import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AppState } from '../../core/store/app.state';
import { 
  selectOptioSyncEnabled, 
  selectSettingsLoading,
  selectSettings
} from '../../core/store/selectors/settings.selectors';
import { 
  selectLastApiRequest,
  selectLastApiResponse,
  selectAllEvents
} from '../../core/store/selectors/event.selectors';
import { 
  toggleOptioSync,
  resetDatabase,
  loadSettings
} from '../../core/store/actions/settings.actions';
import { 
  loadLastApiResponse,
  loadEvents
} from '../../core/store/actions/event.actions';
import { Event } from '../../core/models/event.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {
  optioSyncEnabled$: Observable<boolean>;
  lastApiRequest$: Observable<string | null>;
  lastApiResponse$: Observable<string | null>;
  settings$: Observable<{ [key: string]: string }>;
  events$: Observable<Event[]>;
  loading$: Observable<boolean>;
  
  constructor(
    private store: Store<AppState>,
    private snackBar: MatSnackBar
  ) {
    this.optioSyncEnabled$ = this.store.select(selectOptioSyncEnabled);
    this.lastApiRequest$ = this.store.select(selectLastApiRequest);
    this.lastApiResponse$ = this.store.select(selectLastApiResponse);
    this.settings$ = this.store.select(selectSettings);
    this.events$ = this.store.select(selectAllEvents);
    this.loading$ = this.store.select(selectSettingsLoading);
  }
  
  ngOnInit() {
    this.store.dispatch(loadSettings());
    this.store.dispatch(loadLastApiResponse());
    this.store.dispatch(loadEvents());
  }
  
  toggleOptioSync(enabled: boolean) {
    this.store.dispatch(toggleOptioSync({ enabled }));
    
    // Subscribe to loading to detect when operation is complete
    const loadingSub = this.loading$.subscribe(loading => {
      if (!loading) {
        this.snackBar.open(`Optio Sync ${enabled ? 'enabled' : 'disabled'}`, 'Close', {
          duration: 3000,
          panelClass: ['bg-success', 'text-white']
        });
        loadingSub.unsubscribe();
      }
    });
  }
  
  resetDatabase() {
    if (confirm('Are you sure you want to reset the database? This will delete all data.')) {
      this.store.dispatch(resetDatabase());
      
      // Subscribe to loading to detect when operation is complete
      const loadingSub = this.loading$.subscribe(loading => {
        if (!loading) {
          this.snackBar.open('Database reset successfully', 'Close', {
            duration: 3000,
            panelClass: ['bg-success', 'text-white']
          });
          loadingSub.unsubscribe();
        }
      });
    }
  }
  
  formatJson(json: string | null): string {
    if (!json) return '';
    try {
      return JSON.stringify(JSON.parse(json), null, 2);
    } catch (e) {
      return json;
    }
  }
}
