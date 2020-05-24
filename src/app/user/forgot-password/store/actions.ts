// ngrx
import { createAction, props } from '@ngrx/store';
// custom
import * as  ForgotPasswordModels from './models';

export enum ActionTypes {
    FORGOT_PASSWORD_START = '[Forgot_Password] Forgot Password Start',
    FORGOT_PASSWORD = '[Forgot_Password] Forgot Password',
    FORGOT_PASSWORD_ERROR = '[Forgot_Password] Forgot Password Error',
    RESET = '[Forgot_Password] Reset',
}

export const forgotPasswordStart = createAction(
    ActionTypes.FORGOT_PASSWORD_START,
    props<{ data: ForgotPasswordModels.ForgotPasswordStart }>()
);

export const forgotPassword = createAction(
    ActionTypes.FORGOT_PASSWORD,
    props<{ data: ForgotPasswordModels.ForgotPassword }>()
);

export const forgotPasswordError = createAction(
    ActionTypes.FORGOT_PASSWORD_ERROR,
    props<ForgotPasswordModels.Error>()
);

export const reset = createAction(
    ActionTypes.RESET
);
