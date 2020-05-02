// ngrx
import { createReducer, Action, on } from '@ngrx/store';
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
};

export const key = 'forgot-password';
