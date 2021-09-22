import { OverlayContainer } from '@angular/cdk/overlay';
import { Inject, Injectable } from '@angular/core';

import { WindowToken } from '../config';

type ThemeClassType = 'light-theme' | 'dark-theme';

export interface ThemeData {
  isDark: boolean;
  themeClass: ThemeClassType;
}

/* istanbul ignore next */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDark = false;
  themeClass: ThemeClassType = 'light-theme';
  private classList: ThemeClassType[] = ['light-theme', 'dark-theme'];
  private readonly key = 'is_dark_theme';

  constructor(
    private overlayContainer: OverlayContainer,
    @Inject(WindowToken) private window: Window) { }

  initTheme(): ThemeData {

    const theme = this.window.localStorage.getItem(this.key);

    if (theme) {
      this.isDark = JSON.parse(theme) === true;
    }
    else {
      this.isDark = false;
    }

    this.isDark ? this.themeClass = this.classList[1] : this.themeClass = this.classList[0];
    const overlayContainerClasses = this.overlayContainer.getContainerElement().classList;
    const themeClassesToRemove = Array.from(this.classList).filter((item: string) => item.includes('-theme'));
    if (themeClassesToRemove.length) {
      overlayContainerClasses.remove(...themeClassesToRemove);
    }
    overlayContainerClasses.add(this.themeClass);
    return { isDark: this.isDark, themeClass: this.themeClass };
  }

  switchTheme(): ThemeData {
    this.isDark = !this.isDark;
    this.window.localStorage.setItem(this.key, String(this.isDark));
    this.isDark ? this.themeClass = this.classList[1] : this.themeClass = this.classList[0];
    return { isDark: this.isDark, themeClass: this.themeClass };
  }
}
