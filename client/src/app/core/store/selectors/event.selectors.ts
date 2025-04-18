import { createSelector, createFeatureSelector } from '@ngrx/store';
import { EventState } from '../reducers/event.reducer';

export const selectEventsState = createFeatureSelector<EventState>('events');

export const selectAllEvents = createSelector(
  selectEventsState,
  (state: EventState) => state.events
);

export const selectSelectedEvent = createSelector(
  selectEventsState,
  (state: EventState) => state.selectedEvent
);

export const selectLastApiRequest = createSelector(
  selectEventsState,
  (state: EventState) => state.lastApiRequest
);

export const selectLastApiResponse = createSelector(
  selectEventsState,
  (state: EventState) => state.lastApiResponse
);

export const selectEventsLoading = createSelector(
  selectEventsState,
  (state: EventState) => state.loading
);

export const selectEventsError = createSelector(
  selectEventsState,
  (state: EventState) => state.error
);

export const selectRecentEvents = createSelector(
  selectAllEvents,
  (events) => events.slice(0, 5)
);
