// angular
import { ErrorHandler, Injectable } from '@angular/core';
// custom
import { LoggerService } from '../services';

/* istanbul ignore next */
@Injectable()
export class ErrorInterceptor implements ErrorHandler {

  constructor(private logger: LoggerService) { }


  handleError(error: any): void {

    this.logger.error(error);

  }

}
