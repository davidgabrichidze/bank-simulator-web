import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, filter } from 'rxjs';

import { AppState } from '../../../core/store/app.state';
import { selectOptioSyncEnabled } from '../../../core/store/selectors/settings.selectors';
import { toggleOptioSync } from '../../../core/store/actions/settings.actions';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  optioSyncEnabled$: Observable<boolean>;
  currentRoute: string = '';
  
  constructor(
    private router: Router,
    private store: Store<AppState>
  ) {
    this.optioSyncEnabled$ = this.store.select(selectOptioSyncEnabled);
  }
  
  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.urlAfterRedirects;
      });
  }
  
  isActive(route: string): boolean {
    return this.currentRoute.startsWith(route);
  }
  
  toggleOptioSync(event: any) {
    this.store.dispatch(toggleOptioSync({ enabled: event.checked }));
  }
}
