// angular
import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject, Renderer2 } from '@angular/core';
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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  mediaQueryList?: MediaQueryList;
  isHandset$?: Observable<boolean>;
  isLoading = true;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private store$: Store<fromApp.AppState>,
    private router: Router,
    private renderer2: Renderer2,
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void {

    this.drawParticle('particles-js', '../assets/particlesjs-config.json');

    this.onLoading();

    this.isHandset$ = this.breakpointObserver
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

  private onLoading(): void {
    this.store$
      .pipe(
        select(fromAuth.selectLoading),
        filter(res => !res)
      )
      .subscribe((res) => {

        if (isPlatformBrowser(this.platformId)) {
          this.isLoading = res;
          const element = this.document.getElementById('loading-box');
          this.renderer2.setStyle(element, 'display', 'none');
        }

      });

  }

  async drawParticle(id: string, config: string): Promise<void> {

    if (isPlatformBrowser(this.platformId)) {
      const particle = await import(
        /* webpackMode: "lazy" */
        'tsparticles'
      ).then(({ tsParticles }) => tsParticles);

      particle.loadJSON(id, config);
    }

  }

}
