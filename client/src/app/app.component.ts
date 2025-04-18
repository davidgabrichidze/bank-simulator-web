import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState } from './core/store/app.state';
import { selectDarkMode } from './core/store/selectors/settings.selectors';
import { loadSettings } from './core/store/actions/settings.actions';
import { loadAccounts } from './core/store/actions/account.actions';
import { loadEvents } from './core/store/actions/event.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  darkMode$: Observable<boolean>;
  
  constructor(private store: Store<AppState>) {
    this.darkMode$ = this.store.select(selectDarkMode);
  }
  
  ngOnInit() {
    // Initialize app data
    this.store.dispatch(loadSettings());
    this.store.dispatch(loadAccounts());
    this.store.dispatch(loadEvents());
  }
}
