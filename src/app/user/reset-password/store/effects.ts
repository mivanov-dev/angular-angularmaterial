// angular
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// rxjs
import { of } from 'rxjs';
import { tap, map, exhaustMap, catchError } from 'rxjs/operators';
// ngrx
import { Actions, ofType, createEffect } from '@ngrx/effects';
// custom
import * as ResetPasswordActions from '@app/user/reset-password/store/actions';
import { ResetPasswordService } from '@app/user/reset-password/services/reset-password.service';

@Injectable()
export class ResetPasswordEffects {

    resetPasswordStart$ = createEffect(() => this._actions$
        .pipe(
            ofType(ResetPasswordActions.resetPasswordStart),
            map(action => action.data),
            exhaustMap((data) => this._resetPasswordService.resetPassword$(data)
                .pipe(
                    map(() => ResetPasswordActions.resetPassword()),
                    catchError((error) => of(ResetPasswordActions.resetPasswordError({ error: error.error.message })))
                )
            )
        ));

    resetPassword$ = createEffect(() => this._actions$
        .pipe(
            ofType(ResetPasswordActions.resetPassword),
            tap((res) => {

                this._router.navigate(['/user/auth']);

            })
        ), { dispatch: false });

    constructor(private _actions$: Actions,
        private _router: Router,
        private _resetPasswordService: ResetPasswordService) { }

}