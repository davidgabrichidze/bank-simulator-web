import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState } from '../../../core/store/app.state';
import { selectDarkMode } from '../../../core/store/selectors/settings.selectors';
import { toggleDarkMode } from '../../../core/store/actions/settings.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  darkMode$: Observable<boolean>;
  sidebarVisible = false;
  
  constructor(private store: Store<AppState>) {
    this.darkMode$ = this.store.select(selectDarkMode);
  }
  
  toggleDarkMode() {
    this.store.dispatch(toggleDarkMode());
  }
  
  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
}
