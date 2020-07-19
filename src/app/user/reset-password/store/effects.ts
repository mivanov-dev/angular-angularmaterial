// angular
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// rxjs
import { of } from 'rxjs';
import { tap, map, exhaustMap, catchError } from 'rxjs/operators';
// ngrx
import { Actions, ofType, createEffect } from '@ngrx/effects';
// custom
import * as ResetPasswordActions from '../../../user/reset-password/store/actions';
import { ResetPasswordService } from '../../../user/reset-password/services/reset-password.service';

@Injectable()
export class ResetPasswordEffects {

    constructor(private actions$: Actions,
                private router: Router,
                private resetPasswordService: ResetPasswordService) { }

    resetPasswordStart$ = createEffect(() => this.actions$
        .pipe(
            ofType(ResetPasswordActions.resetPasswordStart),
            map(action => action.data),
            exhaustMap((data) => this.resetPasswordService.resetPassword$(data)
                .pipe(
                    map(() => ResetPasswordActions.resetPassword()),
                    catchError((error) => of(ResetPasswordActions.resetPasswordError({ error: error.error.message })))
                )
            )
        ));

    resetPassword$ = createEffect(() => this.actions$
        .pipe(
            ofType(ResetPasswordActions.resetPassword),
            tap((res) => {

                this.router.navigate(['/user/auth']);

            })
        ), { dispatch: false });

}
