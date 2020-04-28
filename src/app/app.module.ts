// angular
import { BrowserModule, HammerModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { NgModule, PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
// ngrx
import { StoreRouterConnectingModule, RouterState } from '@ngrx/router-store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
// custom
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import * as fromApp from './store/reducer';
import { environment } from '@env/environment';
import { ProviderModule } from './provider.module';
import { SharedModule } from './shared/shared.module';
import { HomeComponent } from './home';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header';
import { AuthEffects } from './user/auth/store/effects';
import { ForgotPasswordEffects } from './user/forgot-password/store/effects';
import { ResetPasswordEffects } from './user/reset-password/store/effects';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    FooterComponent
  ],
  imports: [
    HammerModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserTransferStateModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    // import HttpClientModule after BrowserModule or Browser... !
    HttpClientModule,
    ProviderModule,
    StoreModule.forRoot(fromApp.reducers, {
      metaReducers: fromApp.metaReducers,
      runtimeChecks: fromApp.runtimeChecks
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: !environment.production
    }),
    EffectsModule.forRoot([
      AuthEffects,
      ForgotPasswordEffects,
      ResetPasswordEffects,
    ]),
    StoreRouterConnectingModule.forRoot({
      routerState: RouterState.Minimal
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    SharedModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(APP_ID) private appId: string) {

    if (isPlatformBrowser(this.platformId)) {
      console.log(`browser:appId=${appId}`)
    }
    if (isPlatformServer(this.platformId)) {
      console.log(`server:appId=${appId}`)
    }

  }

}
