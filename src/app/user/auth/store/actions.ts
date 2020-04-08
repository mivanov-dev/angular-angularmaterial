// ngrx
import { createAction, props } from '@ngrx/store';
// custom
import * as AuthModels from './models';

export enum ActionTypes {
    LOGIN_START = '[Auth] Login Start',
    LOGIN = '[Auth] Login',
    LOGIN_ERROR = '[Auth] Login Error',
    REGISTER_START = '[Auth] Register Start',
    REGISTER = '[Auth] Register',
    REGISTER_ERROR = '[Auth] Register Error',
    LOGOUT_START = '[Auth] Logout Start',
    LOGOUT = '[Auth] Logout',
    LOGOUT_ERROR = '[Auth] Logout Error',
    AUTOLOGIN_START = '[Auth] AutoLogin Start',
    AUTH_MODE = '[Auth] Auth Mode',
    RESET_ON_SUCCESSFUL_LOGIN = '[Auth] Reset On Successful Login',
};

// LOGIN
export const loginStart = createAction(
    ActionTypes.LOGIN_START,
    props<{ data: AuthModels.LoginStart }>()
);
export const login = createAction(
    ActionTypes.LOGIN,
    props<{ data: AuthModels.Login }>()
);
export const loginError = createAction(
    ActionTypes.LOGIN_ERROR,
    props<AuthModels.Error>()
);

// REGISTER
export const registerStart = createAction(
    ActionTypes.REGISTER_START,
    props<{ data: AuthModels.RegisterStart }>()
);
export const register = createAction(
    ActionTypes.REGISTER,
    props<{ data: AuthModels.Register }>()
);
export const registerError = createAction(
    ActionTypes.REGISTER_ERROR,
    props<AuthModels.Error>()
);

// LOGOUT
export const logoutStart = createAction(
    ActionTypes.LOGOUT_START
);
export const logout = createAction(
    ActionTypes.LOGOUT
);
export const logoutError = createAction(
    ActionTypes.LOGOUT_ERROR, props<AuthModels.Error>()
);

// AUTOLOGIN
export const autologinStart = createAction(
    ActionTypes.AUTOLOGIN_START
);

// AUTHMODE
export const switchModeTo = createAction(
    ActionTypes.AUTH_MODE, props<{ authMode: AuthModels.AuthMode }>()
);

// RESET
export const resetOnSuccessfulLogin = createAction(
    ActionTypes.RESET_ON_SUCCESSFUL_LOGIN
);