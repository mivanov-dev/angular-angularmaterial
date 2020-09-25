// angular
import { InjectionToken } from '@angular/core';
// ngrx
import { ActionReducerMap, Action, ActionReducer, MetaReducer, State, RuntimeChecks } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import * as fromRouter from '@ngrx/router-store';
// custom
import * as fromAuth from '../user/auth/store/reducer';
import { environment } from '../../environments/environment';
import * as fromForgotPassword from '../user/forgot-password/store/reducer';
import * as fromResetPassword from '../user/reset-password/store/reducer';
import * as fromComment from '../scroll/store/reducer/reducer';

export interface AppState {
    [fromAuth.key]: fromAuth.State;
    [fromForgotPassword.key]: fromForgotPassword.State;
    [fromResetPassword.key]: fromResetPassword.State;
    [fromComment.key]: fromComment.State;
    router: fromRouter.RouterReducerState<any>;
}

export const reducers = new InjectionToken<ActionReducerMap<AppState, Action>>('root reducers', {
    factory: () => ({

        [fromAuth.key]: fromAuth.reducer,
        [fromForgotPassword.key]: fromForgotPassword.reducer,
        [fromResetPassword.key]: fromResetPassword.reducer,
        [fromComment.key]: fromComment.reducer,
        router: fromRouter.routerReducer,

    })
});

export function debug(reducer: ActionReducer<any>): ActionReducer<any> {

    return (state: State<any>, action: Action) => {

        const result = reducer(state, action);
        console.groupCollapsed(action.type);
        console.log('prev state', state);
        console.log('action', action);
        console.log('next state', result);
        console.groupEnd();
        return result;

    };

}

export const metaReducers: MetaReducer<any>[] = !environment.production ? [debug, storeFreeze] : [];

export const runtimeChecks: RuntimeChecks = {
    strictStateImmutability: true,
    strictActionImmutability: true,
    strictStateSerializability: true,
    strictActionSerializability: true,
    strictActionWithinNgZone: true
};
