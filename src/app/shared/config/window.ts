import { InjectionToken } from '@angular/core';

export const WindowToken = new InjectionToken<Window>('Window');
export function windowProvider(): Window { return window; }
