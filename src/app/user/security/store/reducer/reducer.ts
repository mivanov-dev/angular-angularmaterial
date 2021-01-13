// ngrx
import { createReducer, Action, on } from '@ngrx/store';
// custom
import * as QrModels from '../models';
import * as QrActions from '../actions';

export interface State {
  setup: QrModels.Setup | null;
  verify: QrModels.Verify | null;
  error: any;
  loading: boolean;
}

export const initState: State = {
  setup: null,
  verify: null,
  error: null,
  loading: false,
};

export const qrReducer = createReducer<State>(
  initState,
  /**
   * SETUP
   */
  on(QrActions.setupStart, (state) => ({
    ...state,
    loading: true,
  })),
  on(QrActions.setup, (state, { data }) => ({
    ...state,
    setup: data,
    error: null,
    loading: false,
  })),
  on(QrActions.setupError, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  /**
   * VERIFY
   */
  on(QrActions.verifyStart, (state) => ({
    ...state,
    loading: true,
  })),
  on(QrActions.verify, (state, { data }) => ({
    ...state,
    verify: data,
    error: null,
    loading: false,
  })),
  on(QrActions.verifyError, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  /**
   * RESET
   */
  on(QrActions.reset, (state) => ({
    ...state,
    setup: null,
    error: null,
    loading: false,
  })),
);

export const reducer = (state: State | undefined, action: Action) => {
  return qrReducer(state, action);
};

export const key = 'qr';
