// angular
import { Component, OnInit, OnDestroy } from '@angular/core';
// ngrx
import { Store } from '@ngrx/store';
// rxjs
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// custom
import * as fromApp from '../../store';
import * as fromAuth from '../auth/store/reducer';
import * as AuthModels from '../auth/store/models';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {


  user$: Observable<AuthModels.Login | null>;
  userImage = '../../assets/user.png';
  adminImage = '../../assets/admin.png';
  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(private store$: Store<fromApp.AppState>) {

    this.user$ = this.store$.select(fromAuth.selectLogin).pipe(takeUntil(this.onDestroy$));

  }

  ngOnInit(): void { }

  ngOnDestroy(): void {

    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

}
