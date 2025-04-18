import { createReducer, on } from '@ngrx/store';
import * as SettingsActions from '../actions/settings.actions';

export interface SettingsState {
  optioSyncEnabled: boolean;
  darkMode: boolean;
  settings: { [key: string]: string };
  loading: boolean;
  error: string | null;
}

export const initialState: SettingsState = {
  optioSyncEnabled: true,
  darkMode: false,
  settings: {},
  loading: false,
  error: null
};

export const settingsReducer = createReducer(
  initialState,
  // Load Settings
  on(SettingsActions.loadSettings, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(SettingsActions.loadSettingsSuccess, (state, { settings }) => ({
    ...state,
    settings,
    optioSyncEnabled: settings['optioSyncEnabled'] === 'true',
    darkMode: settings['darkMode'] === 'true',
    loading: false
  })),
  on(SettingsActions.loadSettingsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Update Setting
  on(SettingsActions.updateSetting, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(SettingsActions.updateSettingSuccess, (state, { key, value }) => ({
    ...state,
    settings: {
      ...state.settings,
      [key]: value
    },
    optioSyncEnabled: key === 'optioSyncEnabled' ? value === 'true' : state.optioSyncEnabled,
    darkMode: key === 'darkMode' ? value === 'true' : state.darkMode,
    loading: false
  })),
  on(SettingsActions.updateSettingFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Toggle Optio Sync
  on(SettingsActions.toggleOptioSync, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(SettingsActions.toggleOptioSyncSuccess, (state, { enabled }) => ({
    ...state,
    optioSyncEnabled: enabled,
    settings: {
      ...state.settings,
      optioSyncEnabled: String(enabled)
    },
    loading: false
  })),
  on(SettingsActions.toggleOptioSyncFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Toggle Dark Mode
  on(SettingsActions.toggleDarkMode, state => ({
    ...state,
    darkMode: !state.darkMode,
    settings: {
      ...state.settings,
      darkMode: String(!state.darkMode)
    }
  })),

  // Reset Database
  on(SettingsActions.resetDatabase, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(SettingsActions.resetDatabaseSuccess, state => ({
    ...state,
    loading: false
  })),
  on(SettingsActions.resetDatabaseFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
