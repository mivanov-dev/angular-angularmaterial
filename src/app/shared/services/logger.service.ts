// angular
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
// custom
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class LoggerService {

  constructor(@Inject(PLATFORM_ID) private platformId: any) { }

  log(value: any, ...rest: any[]): void {

    if (!environment.production && isPlatformBrowser(this.platformId)) {
      console.log(`%cLOG: ${value} ${rest}`, 'color: lime;');
    }

  }

  error(value: any, ...rest: any[]): void {

    if (isPlatformBrowser(this.platformId)) {
      console.log(`%cERROR: ${value} ${rest}`, 'color: red;');
    }

  }

  warn(value: any, ...rest: any[]): void {

    if (isPlatformBrowser(this.platformId)) {
      console.log(`%cWARN: ${value} ${rest}`, 'color: orangered;');
    }

  }

}
