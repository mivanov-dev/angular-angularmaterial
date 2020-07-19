// angular
import { Component, Input, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
// material
import { MatSidenav } from '@angular/material/sidenav';
// rxjs
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// ngrx
import { Store, select } from '@ngrx/store';
// custom
import * as fromApp from '../store';
import * as fromAuth from '../user/auth/store';
import * as AuthActions from '../user/auth/store/actions';
import * as AuthModels from '../user/auth/store/models';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnDestroy {


  @Input() sidenav: MatSidenav;
  user$: Observable<AuthModels.Login>;
  userImage = '../../assets/user.png';
  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(private store$: Store<fromApp.AppState>) {

    this.user$ = this.store$.pipe(takeUntil(this.onDestroy$), select(fromAuth.selectLogin));

  }

  ngOnDestroy(): void {

    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

  onLogout(): void {

    this.store$.dispatch(AuthActions.logoutStart());

  }

  switchAuthModeTo(mode: string): void {

    this.store$.dispatch(AuthActions.switchModeTo({ authMode: { mode } }));

  }

}
