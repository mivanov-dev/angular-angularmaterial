// angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// rxjs
import { Observable } from 'rxjs';
// ngrx
import { Store } from '@ngrx/store';
// custom
import * as fromApp from '@app/store/reducer';
import * as AuthModels from '../store/models';
import * as AuthActions from '../store/actions';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private _registerUrl: string = environment.request.apiUserRegister;
  private _loginUrl: string = environment.request.apiUserLogin;
  private _isLoggedInUrl: string = environment.request.apiUserIsLoggedIn;
  private _logoutUrl: string = environment.request.apiUserLogout;

  private _expirationTimer: any;

  constructor(
    private _store$: Store<fromApp.AppState>,
    private _http: HttpClient) { }

  login$ = (data: AuthModels.LoginStart): Observable<AuthModels.Login> =>
    this._http.post<AuthModels.Login>(this._loginUrl, data);

  register$ = (data: AuthModels.RegisterStart): Observable<AuthModels.Register> =>
    this._http.post<AuthModels.Register>(this._registerUrl, data);

  autoLogin$ = (): Observable<AuthModels.Login> =>
    this._http.get<AuthModels.Login>(this._isLoggedInUrl);

  logout$ = (): Observable<any> =>
    this._http.post(this._logoutUrl, {});



  setLogoutTimer(expirationDate: number): void {

    this._expirationTimer = setTimeout(() => {

      this._store$.dispatch(AuthActions.logout());

    }, expirationDate);

  }

  clearLogoutTimer(): void {

    if (this._expirationTimer) {
      clearTimeout(this._expirationTimer);
      this._expirationTimer = null;
    }

  }

}
