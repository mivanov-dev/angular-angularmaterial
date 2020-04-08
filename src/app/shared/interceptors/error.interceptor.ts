// angular
import { ErrorHandler, Injectable } from '@angular/core';
// custom
import { LoggerService } from '../services';


@Injectable()
export class ErrorInterceptor implements ErrorHandler {

    constructor(private _logger: LoggerService) { }


    handleError = (error): void => this._logger.error(error);

}