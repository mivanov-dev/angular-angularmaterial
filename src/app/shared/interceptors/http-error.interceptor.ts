// angular
import { HttpRequest, HttpInterceptor, HttpHandler, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
// rxjs
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
// custom
import { LoggerService } from '../services';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(private logger: LoggerService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                catchError((error: HttpErrorResponse) => {

                    this.logger.error(error);

                    if (error.status >= 500) {
                        return throwError({ error: { message: 'Have a problem with a server!' } });
                    }

                    return throwError(error);

                })
            );
    }

}
