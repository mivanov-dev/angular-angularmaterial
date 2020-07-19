// ngrx
import { createReducer, Action, on, createSelector, createFeatureSelector } from '@ngrx/store';
// custom
import * as ResetPasswordActions from '../../../user/reset-password/store/actions';

export interface State {
    error: any;
    loading: boolean;
}

export const initState: State = {
    error: null,
    loading: false,
};

export const resetPassReducer = createReducer(
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
    on(ResetPasswordActions.reset, (state) => ({
        ...state,
        error: null
    })),
);

export const reducer = (state: State | undefined, action: Action) => {
    return resetPassReducer(state, action);
};

export const key = 'reset-password';
