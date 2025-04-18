import { createReducer, on } from '@ngrx/store';
import { Event } from '../../models/event.model';
import * as EventActions from '../actions/event.actions';

export interface EventState {
  events: Event[];
  selectedEvent: Event | null;
  lastApiRequest: string | null;
  lastApiResponse: string | null;
  loading: boolean;
  error: string | null;
}

export const initialState: EventState = {
  events: [],
  selectedEvent: null,
  lastApiRequest: null,
  lastApiResponse: null,
  loading: false,
  error: null
};

export const eventReducer = createReducer(
  initialState,
  // Load Events
  on(EventActions.loadEvents, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(EventActions.loadEventsSuccess, (state, { events }) => ({
    ...state,
    events,
    loading: false
  })),
  on(EventActions.loadEventsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load Event
  on(EventActions.loadEvent, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(EventActions.loadEventSuccess, (state, { event }) => ({
    ...state,
    selectedEvent: event,
    loading: false
  })),
  on(EventActions.loadEventFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load Last API Response
  on(EventActions.loadLastApiResponse, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(EventActions.loadLastApiResponseSuccess, (state, { request, response }) => ({
    ...state,
    lastApiRequest: request,
    lastApiResponse: response,
    loading: false
  })),
  on(EventActions.loadLastApiResponseFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
