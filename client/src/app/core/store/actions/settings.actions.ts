import { createAction, props } from '@ngrx/store';

// Load Settings
export const loadSettings = createAction(
  '[Settings] Load Settings'
);

export const loadSettingsSuccess = createAction(
  '[Settings] Load Settings Success',
  props<{ settings: { [key: string]: string } }>()
);

export const loadSettingsFailure = createAction(
  '[Settings] Load Settings Failure',
  props<{ error: string }>()
);

// Update Setting
export const updateSetting = createAction(
  '[Settings] Update Setting',
  props<{ key: string, value: string }>()
);

export const updateSettingSuccess = createAction(
  '[Settings] Update Setting Success',
  props<{ key: string, value: string }>()
);

export const updateSettingFailure = createAction(
  '[Settings] Update Setting Failure',
  props<{ error: string }>()
);

// Toggle Optio Sync
export const toggleOptioSync = createAction(
  '[Settings] Toggle Optio Sync',
  props<{ enabled: boolean }>()
);

export const toggleOptioSyncSuccess = createAction(
  '[Settings] Toggle Optio Sync Success',
  props<{ enabled: boolean }>()
);

export const toggleOptioSyncFailure = createAction(
  '[Settings] Toggle Optio Sync Failure',
  props<{ error: string }>()
);

// Toggle Dark Mode
export const toggleDarkMode = createAction(
  '[Settings] Toggle Dark Mode'
);

// Reset Database
export const resetDatabase = createAction(
  '[Settings] Reset Database'
);

export const resetDatabaseSuccess = createAction(
  '[Settings] Reset Database Success'
);

export const resetDatabaseFailure = createAction(
  '[Settings] Reset Database Failure',
  props<{ error: string }>()
);
