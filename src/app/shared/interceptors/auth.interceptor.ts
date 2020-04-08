// angular
import { Injectable, OnDestroy } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
// rxjs
import { Subject, Observable } from 'rxjs';
import { take, exhaustMap, takeUntil } from 'rxjs/operators';
// ngrx
import { Store, select } from '@ngrx/store';
// custom
import * as fromApp from '@app/store/reducer';
import * as fromAuth from '@app/user/auth/store/reducer';

@Injectable()
export class AuthInterceptor implements HttpInterceptor, OnDestroy {

    private _onDestroy$: Subject<void> = new Subject<void>();

    constructor(private _store$: Store<fromApp.AppState>) { }

    ngOnDestroy(): void {
        this._onDestroy$.next();
        this._onDestroy$.complete();
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return this._store$
            .pipe(
                select(fromAuth.selectLogin),
                takeUntil(this._onDestroy$),
                take(1),
                exhaustMap((res) => {

                    const modifiedReq = req.clone({ withCredentials: true });
                    return next.handle(modifiedReq);

                })
            );

    }
}