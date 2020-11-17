// angular
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
// custom
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class LoggerService {

  constructor(@Inject(PLATFORM_ID) private platformId: any) { }

  log(value: any, ...rest: any[]): void {

    if (!environment.production) {
      if (isPlatformBrowser(this.platformId)) {
        console.log('LOG', value, ...rest);
      }
    }

  }

  error(value: any, ...rest: any[]): void {

    if (isPlatformBrowser(this.platformId)) {
      console.error('ERROR', value, ...rest);
    }

  }

  warn(value: any, ...rest: any[]): void {

    if (isPlatformBrowser(this.platformId)) {
      console.warn('WARN', value, ...rest);
    }

  }

}
