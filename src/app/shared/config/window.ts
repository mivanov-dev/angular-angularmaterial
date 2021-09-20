import { InjectionToken } from '@angular/core';

export const WindowToken = new InjectionToken<Window>('Window');
/* istanbul ignore next */
export function windowProvider(): Window { return window; }
