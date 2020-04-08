// angular
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// rxjs
import { Observable, of } from 'rxjs';
import { tap, mergeMap, map, exhaustMap, catchError } from 'rxjs/operators';
// ngrx
import { Actions, ofType, createEffect } from '@ngrx/effects';
// custom
import { AuthService } from '@app/user/auth/services/auth.service';
import * as AuthActions from './actions';

@Injectable()
export class AuthEffects {


    constructor(private _actions$: Actions, private _router: Router, private _authService: AuthService) { }

    /**
     * LOGIN
     */
    loginStart$ = createEffect(() => this._actions$
        .pipe(
            ofType(AuthActions.loginStart),
            map(action => action.data),
            exhaustMap((data) => this._authService.login$(data)
                .pipe(
                    tap((res) => this._authService.setLogoutTimer(+res.expires)),
                    map((res) => AuthActions.login({ data: res })),
                    catchError((error) => of(AuthActions.loginError({ error: error.error.message })))
                )
            )
        ));

    login$ = createEffect(() => this._actions$
        .pipe(
            ofType(AuthActions.login),
            tap((res) => {

                if (res.data.redirect) { this._router.navigate(['/']) }

            })
        ), { dispatch: false });

    /**
     * REGISTER
     */
    registerStart$ = createEffect(() => this._actions$
        .pipe(
            ofType(AuthActions.registerStart),
            map(action => action.data),
            exhaustMap((data) => this._authService.register$(data)
                .pipe(
                    map((res) => AuthActions.register({ data: { message: res.message } })),
                    catchError((error) => of(AuthActions.registerError({ error: error.error.message })))
                )
            )
        ));

    register$ = createEffect(() => this._actions$
        .pipe(
            ofType(AuthActions.register),
            tap(() => { })
        ), { dispatch: false });

    /**
     * AUTOLOGIN
     */
    autoLoginStart$ = createEffect(() => this._actions$
        .pipe(
            ofType(AuthActions.autologinStart),
            exhaustMap(
                () => this._authService.autoLogin$()
                    .pipe(
                        tap((data) => {

                            const duration = (+data.expires) - Date.now();
                            this._authService.setLogoutTimer(duration);

                        }),
                        map((data) => AuthActions.login({ data })),
                        catchError(() => of(AuthActions.loginError(null)))
                    )
            )
        ));

    /**
     * LOGOUT
     */
    logoutStart$ = createEffect(() => this._actions$
        .pipe(
            ofType(AuthActions.logoutStart),
            exhaustMap(
                () => this._authService.logout$()
                    .pipe(
                        map(() => AuthActions.logout()),
                        catchError(() => of(AuthActions.logoutError(null)))
                    )
            )
        ));

    logout$ = createEffect(() => this._actions$
        .pipe(
            ofType(AuthActions.logout),
            tap(() => {

                this._authService.clearLogoutTimer();
                this._router.navigate(['/']);

            })
        ), { dispatch: false });

    /**
     * AUTHMODE
     */
    authMode$ = createEffect(() => this._actions$
        .pipe(
            ofType(AuthActions.switchModeTo),
            mergeMap((data) => this.changeAuthMode$(data.authMode.mode)),
        ), { dispatch: false });


    private changeAuthMode$(v: string): Observable<string> {

        return new Observable<string>((o) => {

            o.next(v);
            o.complete();

        });

    }

}