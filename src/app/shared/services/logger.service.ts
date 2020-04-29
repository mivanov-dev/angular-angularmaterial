// angular
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
// custom
import { environment } from 'src/environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class LoggerService {

    constructor(@Inject(PLATFORM_ID) private _platformId) { }

    log(value: any, ...rest: any[]): void {

        if (!environment.production) {
            if (isPlatformBrowser(this._platformId)) {
                console.log('LOG', value, ...rest)
            }
        }

    }

    error = (value: any, ...rest: any[]): void => {

        if (isPlatformBrowser(this._platformId)) {
            console.error('ERROR', value, ...rest);
        }

    }

    warn = (value: any, ...rest: any[]): void => {

        if (isPlatformBrowser(this._platformId)) {
            console.warn('WARN', value, ...rest);
        }

    }

}