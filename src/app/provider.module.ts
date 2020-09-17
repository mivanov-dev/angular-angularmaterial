// angular
import { NgModule, APP_INITIALIZER, ErrorHandler } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';
import { SwRegistrationOptions } from '@angular/service-worker';
// rxjs
import { filter } from 'rxjs/operators';
// ngrx
import { Store } from '@ngrx/store';
// custom
import { SeoService, SwService } from './shared/services';
import * as fromApp from '../app/store';
import * as fromAuth from './user/auth/store/reducer/';
import * as AuthActions from './user/auth/store/actions';
import { TokenResolver } from './user/reset-password/resolvers';
import { AuthInterceptor, HttpErrorInterceptor, ErrorInterceptor } from './shared/interceptors';
import { DirtyCheckGuard } from './shared/guards';

export const appInit = (store: Store<fromApp.AppState>) => {

  return () => new Promise((resolve: any) => {

    store.dispatch(AuthActions.autologinStart());
    store.select(fromAuth.selectLoading)
      .pipe(filter(loading => !loading))
      .subscribe(res => {

        if (!res) {
          resolve(true);
        }

      });
  });

};

@NgModule({
  providers: [
    SwService,
    SeoService,
    TokenResolver,
    DirtyCheckGuard,
    {
      provide: APP_INITIALIZER,
      useFactory: appInit,
      deps: [Store],
      multi: true
    },
    {
      provide: APP_BASE_HREF,
      useValue: '/'
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
    {
      provide: ErrorHandler,
      useClass: ErrorInterceptor
    },
    {
      provide: SwRegistrationOptions,
      useFactory: () => ({
        enabled: location.search.includes('sw=true'),
        registrationStrategy: 'registerImmediately'
      }),
    }
  ]
})
export class ProviderModule { }
