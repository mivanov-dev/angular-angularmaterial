// ngrx
import { createAction, props } from '@ngrx/store';
// custom
import * as ResetPassword from './models';

export enum ActionTypes {
    RESET_PASSWORD_START = '[Reset_Password] Reset Password Start',
    RESET_PASSWORD = '[Reset_Password] Reset Password',
    RESET_PASSWORD_ERROR = '[Reset_Password] Reset Password Error',
}

export const resetPasswordStart = createAction(
    ActionTypes.RESET_PASSWORD_START,
    props<{ data: ResetPassword.ResetPasswordStart }>()
);
export const resetPassword = createAction(
    ActionTypes.RESET_PASSWORD
);
export const resetPasswordError = createAction(
    ActionTypes.RESET_PASSWORD_ERROR,
    props<ResetPassword.IError>()
);
