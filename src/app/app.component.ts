// angular
import { Component, OnInit, Inject, Renderer2, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DOCUMENT } from '@angular/common';
// cdk
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
// rxjs
import { Observable } from 'rxjs';
import { map, shareReplay, filter } from 'rxjs/operators';
// ngrx
import { Store } from '@ngrx/store';
// tsparticles
import { tsParticles } from 'tsparticles';
// custom
import * as fromApp from './store/reducer';
import * as fromAuth from './user/auth/store/reducer';
import { LoggerService, SwService } from './shared/services';
import { ParticlesDarkOptionsToken, ParticlesOptionsToken } from './shared/config';
import { ThemeService, ThemeData } from './shared/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  isHandset$?: Observable<boolean>;
  isLoading = true;
  particlesOptions: object;
  themeClass: string;
  public readonly particleId = 'particles-js';

  constructor(
    private breakpointObserver: BreakpointObserver,
    private store$: Store<fromApp.AppState>,
    private renderer2: Renderer2,
    private sw: SwService,
    private logger: LoggerService,
    private theme: ThemeService,
    @Inject(ParticlesOptionsToken) private particlesOptionsToken: object,
    @Inject(ParticlesDarkOptionsToken) private particlesDarkOptionsToken: object,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.themeClass = this.theme.themeClass;
    if (this.theme.isDark) {
      this.particlesOptions = this.particlesDarkOptionsToken;
    }
    else {
      this.particlesOptions = this.particlesOptionsToken;
    }
  }

  ngOnInit(): void {

    this.sw.update();

    this.subscribeLoading();

    this.isHandset$ = this.breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        shareReplay(1)
      );
  }

  ngAfterViewInit(): void {

    this.drawParticle(this.particleId, this.particlesOptions);

  }

  prepareRoute(routerOutlet: RouterOutlet): boolean {

    return routerOutlet && routerOutlet.activatedRouteData && routerOutlet.activatedRouteData.animation;

  }

  private subscribeLoading(): void {
    this.store$.select(fromAuth.selectLoading)
      .pipe(
        filter(res => !res)
      )
      .subscribe((res) => {

        this.isLoading = res;
        const element = this.document.getElementById('loading-box');
        this.renderer2.setStyle(element, 'display', 'none');

      });

  }

  private async drawParticle(id: string, config: object): Promise<void> {

    try {
      if (this.document.getElementById(id)) {
        tsParticles.load(id, config);
      }
      else {
        throw new Error('check particle configuration');
      }
    } catch (error) {
      this.logger.error((error as Error).message);
    }

  }

  switchTheme(e: ThemeData): void {
    this.themeClass = e.themeClass;
    if (e.isDark) {
      this.drawParticle(this.particleId, this.particlesDarkOptionsToken);
    }
    else {
      this.drawParticle(this.particleId, this.particlesOptionsToken);
    }
  }

}
