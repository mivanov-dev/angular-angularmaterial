import { Logger, createLogger, format, transports } from 'winston';
import * as moment from 'moment';

// https://thisdavej.com/using-winston-a-versatile-logging-library-for-node-js/
const log: Logger = createLogger({
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

export { log };