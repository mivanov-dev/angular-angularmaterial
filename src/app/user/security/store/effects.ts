// angular
import { Injectable } from '@angular/core';
// rxjs
import { of } from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';
// ngrx
import { Actions, ofType, createEffect } from '@ngrx/effects';
// custom
import { QrService } from '../services/qr.service';
import * as QrActions from './actions';

@Injectable()
export class QrEffects {


    constructor(private actions$: Actions, private qrService: QrService) { }

    setupStart$ = createEffect(() => this.actions$
        .pipe(
            ofType(QrActions.setupStart),
            map(action => action.data),
            exhaustMap((data) => this.qrService.setup$(data)
                .pipe(
                    map((res) => QrActions.setup({ data: res })),
                    catchError((error) => of(QrActions.setupError({ error: error.error.message })))
                )
            )
        ));

    setup$ = createEffect(() => this.actions$
        .pipe(
            ofType(QrActions.setup),
            // tap((res) => { })
        ), { dispatch: false });

    verifyStart$ = createEffect(() => this.actions$
        .pipe(
            ofType(QrActions.verifyStart),
            map(action => action.data),
            exhaustMap((data) => this.qrService.verify$(data)
                .pipe(
                    map((res) => QrActions.verify({ data: res })),
                    catchError((error) => of(QrActions.verifyError({ error: error.error.message })))
                )
            )
        ));

    verify$ = createEffect(() => this.actions$
        .pipe(
            ofType(QrActions.verify),
            // tap((res) => { })
        ), { dispatch: false });

}
