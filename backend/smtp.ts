import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
// custom
import { log } from './logger';
import { config } from './config';


export class Smtp {

    private static _instance: Smtp;
    private _smtpTransport: Transporter;

    private constructor() {

        this._init();

    }

    public static getInstance(): Smtp {

        if (!Smtp._instance) {
            Smtp._instance = new Smtp();
        }

        return Smtp._instance;

    }

    private _init(): void {

        log.info('smtp:init');

        // https://ethereal.email/create
        this._smtpTransport = nodemailer.createTransport(config.smtp);

        this._smtpTransport.on('error', (error) => log.error(`smtp:error: ${JSON.stringify(error)}`));

    }

    async verify() {

        try {

            const result = await this._smtpTransport.verify();

            log.info('smtp:verify');

            if (!result) {
                this._smtpTransport.close();
            }
        }
        catch (error) {

            log.error(`smtp:verify: ${JSON.stringify(error)}`);
            this._smtpTransport.close();

        };

    }

    sendMail(to, subject, html): Promise<any> {

        return this._smtpTransport
            .sendMail({
                from: 'bryon29@ethereal.email',
                to,
                subject,
                html
            });

    }

    close(): void {

        log.info(`smtp:close`);
        this._smtpTransport.close();

    }

};