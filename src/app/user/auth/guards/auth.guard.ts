// angular
import { CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Injectable, OnDestroy } from '@angular/core';
// rxjs
import { Observable, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
// ngrx
import { Store, select } from '@ngrx/store';
// custom
import * as fromApp from '@app/store/reducer';
import * as fromAuth from '@app/user/auth/store';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, OnDestroy {

    private _onDestroy$: Subject<void> = new Subject<void>();

    constructor(
        private _router: Router,
        private _store$: Store<fromApp.AppState>) { }

    ngOnDestroy(): void {

        this._onDestroy$.next();
        this._onDestroy$.complete();

    }

    canActivate(
        activatedRouteSnapshot: ActivatedRouteSnapshot,
        routerStateSnapshot: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

        return this._store$
            .pipe(
                takeUntil(this._onDestroy$),
                take(1),
                select(fromAuth.selectLogin),
                map((user) => {

                    const isAuth = user !== null;

                    if (isAuth) {
                        return true;
                    }

                    // return this.router.createUrlTree(['/user/auth']);
                    this._router.navigate(['/user/auth']);
                    return false;

                })
            );

    }

}