// angular
import { Component, Input, OnDestroy, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes,
} from '@angular/animations';
// material
import { MatSidenav } from '@angular/material/sidenav';
// rxjs
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
// ngrx
import { Store } from '@ngrx/store';
// custom
import * as fromApp from '@app/store';
import * as fromAuth from '@app/user/auth/store/reducer';
import * as AuthActions from '@app/user/auth/store/actions';
import * as AuthModels from '@app/user/auth/store/models';
import { ThemeData, ThemeService } from '@app/shared/services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('lightDark', [
      state('light', style({
        opacity: '*',
      })),
      state('dark', style({
        opacity: '*',
      })),
      transition('dark => light', [
        animate('0.3s 0ms', keyframes([
          style({
            opacity: 1,
            transform: 'translate3d(0,100%,0)'
          }),
          style({
            opacity: 1,
            transform: 'translateZ(0)'
          })
        ]))
      ]),
      transition('light => dark', [
        animate('0.3s 0ms', keyframes([
          style({
            opacity: 1,
            transform: 'translate3d(0,-100%,0)'
          }),
          style({
            opacity: 1,
            transform: 'translateZ(0)'
          })
        ]))
      ]),
    ])
  ]
})
export class HeaderComponent implements OnDestroy {

  isDark;
  themeClass;
  user$: Observable<AuthModels.LoggedUser | undefined>;
  isLoading$: Observable<boolean>;
  userImage = '../../assets/user.png';
  adminImage = '../../assets/admin.png';
  @Input() sidenav?: MatSidenav;
  @Output() switchThemeEvent: EventEmitter<ThemeData> = new EventEmitter<ThemeData>();
  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(
    private store$: Store<fromApp.AppState>,
    private theme: ThemeService) {

    this.isDark = this.theme.isDark;
    this.themeClass = this.theme.themeClass;

    this.user$ = this.store$.select(fromAuth.selectLogin)
      .pipe(
        takeUntil(this.onDestroy$),
        map(((res) => res?.user))
      );

    this.isLoading$ = this.store$.select(fromAuth.selectLoading)
      .pipe(takeUntil(this.onDestroy$));

  }

  ngOnDestroy(): void {

    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

  logout(): void {

    this.store$.dispatch(AuthActions.logoutStart());

  }

  switchModeTo(mode: AuthModels.AuthModeType): void {

    this.store$.dispatch(AuthActions.switchModeTo({ authMode: { mode } }));

  }

  switchTheme(): void {
    const { isDark, themeClass } = this.theme.switchTheme();
    this.isDark = isDark;
    this.themeClass = themeClass;
    this.switchThemeEvent.emit({ isDark, themeClass });
  }

}
