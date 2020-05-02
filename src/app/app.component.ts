// angular
import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
// cdk
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
// rxjs
import { Observable } from 'rxjs';
import { map, shareReplay, filter } from 'rxjs/operators';
// ngrx
import { Store, select } from '@ngrx/store';
// custom
import * as fromApp from './store/reducer';
import * as fromAuth from './user/auth/store';

declare const particlesJS: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  mediaQueryList: MediaQueryList;
  isHandset$: Observable<boolean>;
  isLoading = true;

  constructor(
    private _breakpointObserver: BreakpointObserver,
    private _store$: Store<fromApp.AppState>,
    private _router: Router,
    @Inject(PLATFORM_ID) private _platformId,
    @Inject(DOCUMENT) private _document: Document,
  ) { }

  ngOnInit(): void {

    if (isPlatformBrowser(this._platformId)) {
      particlesJS.load('particles-js', './assets/particlesjs-config.json', () => { });
    }

    this._isLoading();

    this.isHandset$ = this._breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        shareReplay(1)
      );
  }

  ngOnDestroy(): void { }

  prepareRoute(routerOutlet: RouterOutlet): boolean {

    return (
      routerOutlet &&
      routerOutlet.activatedRouteData &&
      routerOutlet.activatedRouteData.animation
    );

  }

  private _isLoading(): void {
    this._store$
      .pipe(
        select(fromAuth.selectLoading),
        filter(res => !res)
      )
      .subscribe((res) => {

        if (isPlatformBrowser(this._platformId)) {
          this.isLoading = res;
          this._document.getElementById('loading-box').style.display = 'none';
        }

      });

  }

}
