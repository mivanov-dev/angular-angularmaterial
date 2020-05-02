// angular
import { Component, OnInit, Input, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
// material
import { MatSidenav } from '@angular/material/sidenav';
// rxjs
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// ngrx
import { Store, select } from '@ngrx/store';
// custom
import * as fromApp from '@app/store';
import * as fromAuth from '@app/user/auth/store';
import * as AuthActions from '@app/user/auth/store/actions';
import * as AuthModels from '@app/user/auth/store/models';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit, OnDestroy {


  @Input() sidenav: MatSidenav;
  private onDestroy$: Subject<void> = new Subject<void>();
  user$: Observable<AuthModels.Login> = this.store$.pipe(takeUntil(this.onDestroy$), select(fromAuth.selectLogin));
  userImage = '../../assets/user.png';

  constructor(private store$: Store<fromApp.AppState>) { }

  ngOnInit(): void { }

  ngOnDestroy(): void {

    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

  onLogout = (): void => this.store$.dispatch(AuthActions.logoutStart());

  switchAuthModeTo = (mode: string): void => this.store$.dispatch(AuthActions.switchModeTo({ authMode: { mode } }));

}
