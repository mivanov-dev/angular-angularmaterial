// ngrx
import { createReducer, Action, on, createSelector, createFeatureSelector } from '@ngrx/store';
// custom
import * as ForgotPasswordActions from './actions';
import * as ForgotPasswordModels from './models';

export interface State {
    forgotPassword: ForgotPasswordModels.ForgotPassword;
    error: any;
    loading: boolean;
}

export const initState: State = {
    forgotPassword: null,
    error: null,
    loading: false,
};

export const forgotPassReducer = createReducer(
    initState,
    on(ForgotPasswordActions.forgotPasswordStart, (state, { data }) => ({
        ...state,
        forgotPassword: null,
        loading: true
    })),
    on(ForgotPasswordActions.forgotPassword, (state, { data }) => ({
        ...state,
        forgotPassword: data,
        error: null,
        loading: false
    })),
    on(ForgotPasswordActions.forgotPasswordError, (state, { error }) => ({
        ...state,
        error,
        loading: false
    })),
    on(ForgotPasswordActions.reset, (state) => ({
        ...state,
        forgotPassword: null,
        error: null
    })),
);

export const reducer = (state: State | undefined, action: Action) => {
    return forgotPassReducer(state, action);
}

export const getError = (state: State) => state.error;
export const getLoading = (state: State) => state.loading;
export const getForgotPassword = (state: State) => state.forgotPassword;

export const key = 'forgot-password';
const featureSelector = createFeatureSelector<State>(key);

export const selectError = createSelector(featureSelector, getError);
export const selectLoading = createSelector(featureSelector, getLoading);
export const selectForgotPassword = createSelector(featureSelector, getForgotPassword);