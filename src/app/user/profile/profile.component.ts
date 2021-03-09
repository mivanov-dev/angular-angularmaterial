// angular
import { Component, OnInit, OnDestroy } from '@angular/core';
// ngrx
import { Store } from '@ngrx/store';
// rxjs
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
// custom
import * as fromApp from '@app/store';
import * as fromAuth from '../auth/store/reducer';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  userImage = '../../assets/user.png';
  adminImage = '../../assets/admin.png';
  private onDestroy$: Subject<void> = new Subject<void>();
  user$ = this.store$.select(fromAuth.selectLogin).pipe(takeUntil(this.onDestroy$), map(res => res?.user));

  constructor(private store$: Store<fromApp.AppState>) { }

  ngOnInit(): void { }

  ngOnDestroy(): void {

    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

}
