// ngrx
import { createReducer, Action, on, createSelector, createFeatureSelector } from '@ngrx/store';
// custom
import * as ResetPasswordActions from '@app/user/reset-password/store/actions';

export interface State {
    error: any;
    loading: boolean;
}

export const initState: State = {
    error: null,
    loading: false,
};

export const reducer = createReducer(
    initState,
    on(ResetPasswordActions.resetPasswordStart, (state, { data }) => ({
        ...state,
        loading: true
    })),
    on(ResetPasswordActions.resetPassword, (state) => ({
        ...state,
        error: null,
        loading: false
    })),
    on(ResetPasswordActions.resetPasswordError, (state, { error }) => ({
        ...state,
        error,
        loading: false
    })),
);

export const getError = (state: State) => state.error;
export const getLoading = (state: State) => state.loading;

export const key = 'reset-password';
export const featureSelector = createFeatureSelector<State>(key);

export const selectError = createSelector(featureSelector, getError);
export const selectLoading = createSelector(featureSelector, getLoading);