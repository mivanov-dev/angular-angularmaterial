// angular
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
// rxjs
import { Observable } from 'rxjs';
// ngrx
import { Store } from '@ngrx/store';
// custom
import * as fromApp from '@app/store';
import * as AuthModels from '../store/models';
import * as AuthActions from '../store/actions';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private registerUrl: string = environment.request.apiUserRegister;
  private loginUrl: string = environment.request.apiUserLogin;
  private isLoggedInUrl: string = environment.request.apiUserIsLoggedIn;
  private logoutUrl: string = environment.request.apiUserLogout;

  private expirationTimer: any;

  constructor(
    private store$: Store<fromApp.AppState>,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId) { }

  login$ = (data: AuthModels.LoginStart): Observable<AuthModels.Login> =>
    this.http.post<AuthModels.Login>(this.loginUrl, data)

  register$ = (data: AuthModels.RegisterStart): Observable<AuthModels.Register> =>
    this.http.post<AuthModels.Register>(this.registerUrl, data)

  autoLogin$ = (): Observable<AuthModels.Login> =>
    this.http.get<AuthModels.Login>(this.isLoggedInUrl)

  logout$ = (): Observable<any> =>
    this.http.post(this.logoutUrl, {})



  setLogoutTimer(expirationDate: number): void {

    if (isPlatformBrowser(this.platformId)) {
      this.expirationTimer = setTimeout(() => {

        this.store$.dispatch(AuthActions.logout());

      }, expirationDate);
    }

  }

  clearLogoutTimer(): void {

    if (this.expirationTimer && isPlatformBrowser(this.platformId)) {
      clearTimeout(this.expirationTimer);
      this.expirationTimer = null;
    }

  }

}
