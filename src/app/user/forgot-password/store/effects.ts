// angular
import { Injectable } from '@angular/core';
// rxjs
import { of } from 'rxjs';
import { tap, map, exhaustMap, catchError } from 'rxjs/operators';
// ngrx
import { Actions, ofType, createEffect } from '@ngrx/effects';
// custom
import * as ForgotPasswordActions from './actions';
import { ForgotPasswordService } from '@app/user/forgot-password/services/forgot-password.service';

@Injectable()
export class ForgotPasswordEffects {

    forgotPasswordStart$ = createEffect(() => this._actions$
        .pipe(
            ofType(ForgotPasswordActions.forgotPasswordStart),
            map(action => action.data),
            exhaustMap((data) => this._forgotPasswordService.forgotPassword$(data)
                .pipe(
                    // tslint:disable-next-line: no-shadowed-variable
                    map((data) => ForgotPasswordActions.forgotPassword({ data })),
                    catchError((error) => of(ForgotPasswordActions.forgotPasswordError({ error: error.error.message })))
                )
            )
        ));

    forgotPassword$ = createEffect(() => this._actions$
        .pipe(
            ofType(ForgotPasswordActions.forgotPassword),
            tap((res) => { })
        ), { dispatch: false });

    constructor(
        private _actions$: Actions,
        private _forgotPasswordService: ForgotPasswordService) { }

}