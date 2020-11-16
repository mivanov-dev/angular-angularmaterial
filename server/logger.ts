import { Logger, createLogger, format, transports } from 'winston';
import * as moment from 'moment';

class Log {

  private static instance: Log;
  private log: Logger;

  private constructor() {

    this.log = createLogger({
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize({ all: true }),
            format.align(),
            format.printf((info) => {

              const { level, message } = info;
              const date = moment(Date.now()).format('DD/MM/YY hh:mm:ss:SSS');
              return `${date} - ${level}: ${message}`;

            })
          )
        })
      ]
    });

  }

  public static getInstance(): Log {

    if (!Log.instance) {
      Log.instance = new Log();
    }

    return Log.instance;

  }

  info(value: any, ...rest: any[]): void {

    this.log.info(value, ...rest);

  }

  error(value: any, ...rest: any[]): void {

    this.log.error(value, ...rest);

  }

  warn(value: any, ...rest: any[]): void {

    this.log.warn(value, ...rest);

  }
}

export const log = Log.getInstance();
