// angular
import { Component, Input, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
// material
import { MatSidenav } from '@angular/material/sidenav';
// rxjs
import { Observable, Subject } from 'rxjs';
import { map, takeUntil, tap, take } from 'rxjs/operators';
// ngrx
import { Store } from '@ngrx/store';
// custom
import * as fromApp from '../store';
import * as fromAuth from '../user/auth/store/reducer';
import * as AuthActions from '../user/auth/store/actions';
import * as AuthModels from '../user/auth/store/models';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnDestroy {


  user$: Observable<AuthModels.LoggedUser | undefined>;
  userImage = '../../assets/user.png';
  adminImage = '../../assets/admin.png';
  @Input() sidenav?: MatSidenav;
  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(private store$: Store<fromApp.AppState>) {

    this.user$ = this.store$.select(fromAuth.selectLogin).pipe(takeUntil(this.onDestroy$), map((res => res?.user)));

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

}
