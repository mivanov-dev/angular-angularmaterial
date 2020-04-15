// angular
import { InjectionToken } from '@angular/core';
// ngrx
import { ActionReducerMap, Action, ActionReducer, MetaReducer, State, RuntimeChecks } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
// custom
import * as fromAuth from '@app/user/auth/store/reducer';
import { environment } from '@env/environment';
import * as fromForgotPassword from '@app/user/forgot-password/store/reducer';
import * as fromResetPassword from '@app/user/reset-password/store/reducer';

export interface AppState {
    [fromAuth.key]: fromAuth.State;
    [fromForgotPassword.key]: fromForgotPassword.State;
    [fromResetPassword.key]: fromResetPassword.State;
}

export const reducers = new InjectionToken<ActionReducerMap<AppState, Action>>('root reducers', {
    factory: () => ({

        [fromAuth.key]: fromAuth.reducer,
        [fromForgotPassword.key]: fromForgotPassword.reducer,
        [fromResetPassword.key]: fromResetPassword.reducer

    })
});

export function debug(reducer: ActionReducer<any>): ActionReducer<any> {

    return (state: State<any>, action: Action) => {

        console.log('STATE', state);
        console.log('ACTION', action);
        return reducer(state, action);

    };

};

export const metaReducers: MetaReducer<any>[] = !environment.production ? [debug, storeFreeze] : [];

export const runtimeChecks: RuntimeChecks = {
    strictStateImmutability: true,
    strictActionImmutability: true,
    strictStateSerializability: true,
    strictActionSerializability: true,
    strictActionWithinNgZone: true
};