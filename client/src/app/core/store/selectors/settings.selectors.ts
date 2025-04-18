import { createSelector, createFeatureSelector } from '@ngrx/store';
import { SettingsState } from '../reducers/settings.reducer';

export const selectSettingsState = createFeatureSelector<SettingsState>('settings');

export const selectSettings = createSelector(
  selectSettingsState,
  (state: SettingsState) => state.settings
);

export const selectOptioSyncEnabled = createSelector(
  selectSettingsState,
  (state: SettingsState) => state.optioSyncEnabled
);

export const selectDarkMode = createSelector(
  selectSettingsState,
  (state: SettingsState) => state.darkMode
);

export const selectSettingsLoading = createSelector(
  selectSettingsState,
  (state: SettingsState) => state.loading
);

export const selectSettingsError = createSelector(
  selectSettingsState,
  (state: SettingsState) => state.error
);
