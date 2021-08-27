// angular
import { Component, OnDestroy } from '@angular/core';
// ngrx
import { Store } from '@ngrx/store';
// rxjs
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
// custom
import * as fromApp from '@app/store';
import * as fromAuth from '../auth/store/reducer';
import { SeoService } from '@app/shared/services';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnDestroy {

  userImage = '../../assets/user.png';
  adminImage = '../../assets/admin.png';
  private onDestroy$: Subject<void> = new Subject<void>();
  user$ = this.store$.select(fromAuth.selectLogin).pipe(takeUntil(this.onDestroy$), map(res => res?.user));

  constructor(private store$: Store<fromApp.AppState>, private seoService: SeoService) {

    this.seoService.config({ title: 'Profile', url: 'user/profile' });

  }

  ngOnDestroy(): void {

    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

}
