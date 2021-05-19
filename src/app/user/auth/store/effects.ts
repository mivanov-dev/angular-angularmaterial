// angular
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// rxjs
import { Observable, of } from 'rxjs';
import { tap, mergeMap, map, exhaustMap, catchError } from 'rxjs/operators';
// ngrx
import { Actions, ofType, createEffect } from '@ngrx/effects';
// custom
import { AuthService } from '../../../user/auth/services/auth.service';
import * as AuthActions from './actions';

@Injectable()
export class AuthEffects {


  constructor(private actions$: Actions, private router: Router, private authService: AuthService) { }

  /**
   * LOGIN
   */
  loginStart$ = createEffect(() => this.actions$
    .pipe(
      ofType(AuthActions.loginStart),
      map(action => action.data),
      exhaustMap((data) => this.authService.login$(data)
        .pipe(
          tap((res) => {
            if (res.user) {
              this.authService.setLogoutTimer(+res.user.expires);
            }
          }),
          map((res) => AuthActions.login({ data: res })),
          catchError((error) => of(AuthActions.loginError({ error: error.error.message })))
        )
      )
    ));

  login$ = createEffect(() => this.actions$
    .pipe(
      ofType(AuthActions.login),
      tap((res) => {

        if (res.data.user?.redirect) {
          this.router.navigate(['/']);
        }

      })
    ), { dispatch: false });

  /**
   * REGISTER
   */
  registerStart$ = createEffect(() => this.actions$
    .pipe(
      ofType(AuthActions.registerStart),
      map(action => action.data),
      exhaustMap((data) => this.authService.register$(data)
        .pipe(
          map((res) => AuthActions.register({ data: { message: res.message } })),
          catchError((error) => of(AuthActions.registerError({ error: error.error.message })))
        )
      )
    ));

  register$ = createEffect(() => this.actions$
    .pipe(
      ofType(AuthActions.register),
      // tap(() => { })
    ), { dispatch: false });

  /**
   * AUTOLOGIN
   */
  autoLoginStart$ = createEffect(() => this.actions$
    .pipe(
      ofType(AuthActions.autologinStart),
      exhaustMap(
        () => this.authService.autoLogin$()
          .pipe(
            tap((res) => {
              if (res.user) {
                this.authService.setLogoutTimer(+res.user.expires);
              }
            }),
            map((data) => AuthActions.login({ data })),
            catchError((error) => of(AuthActions.loginError({ error: '' })))
          )
      )
    ));

  /**
   * LOGOUT
   */
  logoutStart$ = createEffect(() => this.actions$
    .pipe(
      ofType(AuthActions.logoutStart),
      exhaustMap(
        () => this.authService.logout$()
          .pipe(
            map(() => AuthActions.logout()),
            catchError((error) => of(AuthActions.logoutError({ error: '' })))
          )
      )
    ));

  logout$ = createEffect(() => this.actions$
    .pipe(
      ofType(AuthActions.logout),
      tap(() => {

        this.authService.clearLogoutTimer();
        this.router.navigate(['/']);

      })
    ), { dispatch: false });

  /**
   * AUTHMODE
   */
  authMode$ = createEffect(() => this.actions$
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
