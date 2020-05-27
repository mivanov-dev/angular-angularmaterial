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

    constructor(
        private actions$: Actions,
        private forgotPasswordService: ForgotPasswordService) { }

    forgotPasswordStart$ = createEffect(() => this.actions$
        .pipe(
            ofType(ForgotPasswordActions.forgotPasswordStart),
            map(action => action.data),
            exhaustMap((data) => this.forgotPasswordService.forgotPassword$(data)
                .pipe(
                    // tslint:disable-next-line: no-shadowed-variable
                    map((data) => ForgotPasswordActions.forgotPassword({ data })),
                    catchError((error) => of(ForgotPasswordActions.forgotPasswordError({ error: error.error.message })))
                )
            )
        ));

    forgotPassword$ = createEffect(() => this.actions$
        .pipe(
            ofType(ForgotPasswordActions.forgotPassword),
            tap((res) => { })
        ), { dispatch: false });

}
