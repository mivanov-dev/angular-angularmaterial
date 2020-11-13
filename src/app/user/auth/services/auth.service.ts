// angular
import { Injectable, PLATFORM_ID, Inject, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
// rxjs
import { Observable } from 'rxjs';
// ngrx
import { Store } from '@ngrx/store';
// custom
import * as fromApp from '../../../store';
import * as AuthActions from '../store/actions';
import * as AuthModels from '../store/models';
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
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: any) { }

  login$(data: AuthModels.LoginStart): Observable<AuthModels.Login> {

    return this.http.post<AuthModels.Login>(this.loginUrl, data);

  }

  register$(data: AuthModels.RegisterStart): Observable<AuthModels.Register> {

    return this.http.post<AuthModels.Register>(this.registerUrl, data);

  }

  autoLogin$(): Observable<AuthModels.Login> {

    return this.http.get<AuthModels.Login>(this.isLoggedInUrl);

  }

  logout$(): Observable<any> {

    return this.http.post(this.logoutUrl, {});

  }



  setLogoutTimer(expirationDate: number): void {

    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {

        this.expirationTimer = setTimeout(() => {

          this.zone.run(() => this.store$.dispatch(AuthActions.logout()));

        }, expirationDate);

      });
    }

  }

  clearLogoutTimer(): void {

    if (this.expirationTimer && isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {

        clearTimeout(this.expirationTimer);
        this.expirationTimer = null;

      });
    }

  }

}
