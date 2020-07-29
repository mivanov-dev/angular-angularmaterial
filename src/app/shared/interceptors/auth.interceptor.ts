// angular
import { Injectable, OnDestroy } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
// rxjs
import { Subject, Observable } from 'rxjs';
import { take, exhaustMap, takeUntil, filter } from 'rxjs/operators';
// ngrx
import { Store, select } from '@ngrx/store';
// custom
import * as fromApp from '../../store';
import * as fromAuth from '../../user/auth/store';

@Injectable()
export class AuthInterceptor implements HttpInterceptor, OnDestroy {

    private onDestroy$: Subject<void> = new Subject<void>();

    constructor(private store$: Store<fromApp.AppState>) { }

    ngOnDestroy(): void {

        this.onDestroy$.next();
        this.onDestroy$.complete();

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return this.store$
            .pipe(
                select(fromAuth.selectLogin),
                takeUntil(this.onDestroy$),
                take(1),
                exhaustMap((res) => {

                    const modifiedReq = req.clone({ withCredentials: true });
                    return next.handle(modifiedReq);

                })
            );

    }
}
