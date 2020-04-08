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

const featureReducer = createReducer(
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

export function reducer(state: State | undefined, action: Action) {

    return featureReducer(state, action);

};

const getError = (state: State) => state.error;
const getLoading = (state: State) => state.loading;

export const key = 'reset-password';
const resetPasswordFeatureSelector = createFeatureSelector<State>(key);

export const selectError = createSelector(resetPasswordFeatureSelector, getError);
export const selectLoading = createSelector(resetPasswordFeatureSelector, getLoading);