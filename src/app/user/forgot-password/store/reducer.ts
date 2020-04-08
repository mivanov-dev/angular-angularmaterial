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

const featureReducer = createReducer(
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

export function reducer(state: State | undefined, action: Action) {

    return featureReducer(state, action);

};

const getError = (state: State) => state.error;
const getLoading = (state: State) => state.loading;
const getForgotPassword = (state: State) => state.forgotPassword;

export const key = 'forgot-password';
const forgotPasswordFeatureSelector = createFeatureSelector<State>(key);

export const selectError = createSelector(forgotPasswordFeatureSelector, getError);
export const selectLoading = createSelector(forgotPasswordFeatureSelector, getLoading);
export const selectForgotPassword = createSelector(forgotPasswordFeatureSelector, getForgotPassword);