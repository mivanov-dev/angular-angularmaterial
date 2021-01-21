// ngrx
import { createReducer, Action, on } from '@ngrx/store';
// custom
import * as AuthModels from '../models';
import * as AuthActions from '../actions';

export interface State {
  login: AuthModels.Login | null;
  register: AuthModels.Register | null;
  error: any;
  loading: boolean;
  authMode: AuthModels.AuthMode;
}

export const initState: State = {
  login: null,
  register: null,
  error: null,
  loading: false,
  authMode: { mode: 'login' },
};

export const authReducer = createReducer<State>(
  initState,
  /**
   * LOGIN
   */
  on(AuthActions.loginStart, (state, { data }) => ({
    ...state,
    loading: true,
  })),
  on(AuthActions.login, (state, { data }) => ({
    ...state,
    login: data,
    error: null,
    loading: false,
  })),
  on(AuthActions.loginError, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(AuthActions.updateLogin, (state, { data }) => ({
    ...state,
    login: data
  })),
  /**
   * REGISTER
   */
  on(AuthActions.registerStart, (state) => ({
    ...state,
    loading: true,
  })),
  on(AuthActions.register, (state, { data }) => ({
    ...state,
    register: data,
    error: null,
    loading: false,
  })),
  on(AuthActions.registerError, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  /**
   * LOGOUT
   */
  on(AuthActions.logoutStart, (state) => ({
    ...state,
    loading: true,
  })),
  on(AuthActions.logout, (state) => ({
    ...state,
    login: null,
    loading: false,
  })),
  on(AuthActions.logoutError, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  /**
   * AUTOLOGIN
   */
  on(AuthActions.autologinStart, (state) => ({
    ...state,
    error: null,
    loading: true,
  })),

  /**
   * AUTHMODE
   */
  on(AuthActions.switchModeTo, (state, { authMode }) => ({
    ...state,
    error: null,
    authMode,
  })),

  /**
   * RESET ON
   */
  on(AuthActions.resetOnSuccessfulLogin, (state) => ({
    ...state,
    register: null,
    error: null,
    loading: false,
    authMode: { mode: 'login' },
  })),

);

export const reducer = (state: State | undefined, action: Action) => {
  return authReducer(state, action);
};

export const key = 'auth';
