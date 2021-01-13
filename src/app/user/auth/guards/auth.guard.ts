// angular
import { CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Injectable, OnDestroy } from '@angular/core';
// rxjs
import { Observable, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
// ngrx
import { Store } from '@ngrx/store';
// custom
import * as fromApp from '../../../store';
import * as fromAuth from '../store/reducer';


@Injectable({ providedIn: 'root' })
// @ts-ignore
export class AuthGuard implements CanActivate, OnDestroy {

  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    private store$: Store<fromApp.AppState>) { }

  ngOnDestroy(): void {

    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

  canActivate(
    activatedRouteSnapshot: ActivatedRouteSnapshot,
    routerStateSnapshot: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    return this.store$.select(fromAuth.selectLogin)
      .pipe(
        takeUntil(this.onDestroy$),
        take(1),
        map((user) => {

          const isAuth = user !== null;

          if (isAuth) {
            return true;
          }

          this.router.navigate(['/user/auth']);
          return false;

        })
      );

  }

}
