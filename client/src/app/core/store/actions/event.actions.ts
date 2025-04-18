import { createAction, props } from '@ngrx/store';
import { Event } from '../../models/event.model';

// Load Events
export const loadEvents = createAction(
  '[Event] Load Events'
);

export const loadEventsSuccess = createAction(
  '[Event] Load Events Success',
  props<{ events: Event[] }>()
);

export const loadEventsFailure = createAction(
  '[Event] Load Events Failure',
  props<{ error: string }>()
);

// Load Event
export const loadEvent = createAction(
  '[Event] Load Event',
  props<{ id: number }>()
);

export const loadEventSuccess = createAction(
  '[Event] Load Event Success',
  props<{ event: Event }>()
);

export const loadEventFailure = createAction(
  '[Event] Load Event Failure',
  props<{ error: string }>()
);

// Load Last API Response
export const loadLastApiResponse = createAction(
  '[Event] Load Last API Response'
);

export const loadLastApiResponseSuccess = createAction(
  '[Event] Load Last API Response Success',
  props<{ request: string, response: string }>()
);

export const loadLastApiResponseFailure = createAction(
  '[Event] Load Last API Response Failure',
  props<{ error: string }>()
);
