// angular
import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
// typed
import Typed from 'typed.js';
// custom
import { SeoService } from '@app/shared/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  typed: Typed;

  constructor(private _seoService: SeoService,
    @Inject(PLATFORM_ID) private _platformId) {

    this._seoService.config({ title: 'Home', url: 'home' });

  }

  ngOnInit(): void {

    if (isPlatformBrowser(this._platformId)) {
      this.typed = new Typed('.typed', {
        strings: [
          'Angular',
          'Angular Flex-Layout',
          'Angular Material',
          'Angular Cdk',
          'NgRX',
          'RxJS',
          '& many others 😉'
        ],
        typeSpeed: 25,
        startDelay: 1000,
        backSpeed: 25,
        smartBackspace: true,
        loop: true,
        showCursor: true
      });
    }

  }

  ngOnDestroy(): void {

    if (isPlatformBrowser(this._platformId)) {
      this.typed.destroy();
    }

  }

}
