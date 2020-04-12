// ngrx
import { createReducer, Action, on, createSelector, createFeatureSelector } from '@ngrx/store';
// custom
import * as AuthModels from './models';
import * as AuthActions from './actions';

export interface State {
    login: AuthModels.Login;
    register: AuthModels.Register;
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

export const reducer = createReducer<State>(
    initState,
    /**
     * LOGIN
     */
    on(AuthActions.loginStart, (state, { data }) => ({
        ...state,
        // login: null,
        register: null,
        // error: null,
        loading: true,
        // authMode: { mode: 'login' },
    })),
    on(AuthActions.login, (state, { data }) => ({
        ...state,
        login: data,
        // register: null,
        error: null,
        loading: false,
        // authMode: { mode: 'login' },
    })),
    on(AuthActions.loginError, (state, { error }) => ({
        ...state,
        // login: null,
        // register: null,
        error,
        loading: false,
        // authMode: { mode: 'login' },
    })),
    /**
     * REGISTER
     */
    on(AuthActions.registerStart, (state) => ({
        ...state,
        // login: null,
        // register: null,
        // error: null,
        loading: true,
        // authMode: { mode: 'login' },
    })),
    on(AuthActions.register, (state, { data }) => ({
        ...state,
        // login: null,
        register: data,
        error: null,
        loading: false,
        // authMode: { mode: 'login' },
    })),
    on(AuthActions.registerError, (state, { error }) => ({
        ...state,
        // login: null,
        register: null,
        error,
        loading: false,
        // authMode: { mode: 'login' },
    })),
    /**
     * LOGOUT
     */
    on(AuthActions.logoutStart, (state) => ({
        ...state,
        // login: null,
        // register: null,
        // error: null,
        loading: true,
        // authMode: { mode: 'login' },
    })),
    on(AuthActions.logout, (state) => ({
        ...state,
        login: null,
        // register: null,
        // error: null,
        loading: false,
        // authMode: { mode: 'login' },
    })),
    on(AuthActions.logoutError, (state, { error }) => ({
        ...state,
        // login: null,
        // register: null,
        error,
        loading: false,
        // authMode: { mode: 'login' },
    })),
    /**
     * AUTOLOGIN
     */
    on(AuthActions.autologinStart, (state) => ({
        ...state,
        // login: null,
        // register: null,
        error: null,
        loading: true,
        // authMode: { mode: 'login' },
    })),

    /**
     * AUTHMODE
     */
    on(AuthActions.switchModeTo, (state, { authMode }) => ({
        ...state,
        // login: null,
        // register: null,
        error: null,
        // loading: false,
        authMode,
    })),

    /**
     * RESET ON
     */
    on(AuthActions.resetOnSuccessfulLogin, (state) => ({
        ...state,
        // login: null,
        register: null,
        error: null,
        loading: false,
        authMode: { mode: 'login' },
    })),

);

export const getError = (state: State) => { if (!state.loading) { return state.error; } };
export const getLoading = (state: State) => state.loading;
export const getLogin = (state: State) => state.login;
export const getRegister = (state: State) => state.register;
export const getAuthMode = (state: State) => state.authMode;

export const key = 'auth';
export const featureSelector = createFeatureSelector<State>(key);

export const selectError = createSelector(featureSelector, getError);
export const selectLoading = createSelector(featureSelector, getLoading);
export const selectLogin = createSelector(featureSelector, getLogin);
export const selectRegister = createSelector(featureSelector, getRegister);
export const selectAuthMode = createSelector(featureSelector, getAuthMode);
