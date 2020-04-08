// angular
import { Injectable } from '@angular/core';
// custom
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class LoggerService {

    constructor() { }

    log(value: any, ...rest: any[]): void {

        if (!environment.production) {
            console.log('LOG', value, ...rest)
        }

    }

    error = (value: any, ...rest: any[]): void =>
        console.error('ERROR', value, ...rest);

    warn = (value: any, ...rest: any[]): void =>
        console.warn('WARN', value, ...rest);

}