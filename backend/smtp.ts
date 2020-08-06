import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
// custom
import { log } from './logger';
import { config } from './config';


class Smtp {

    private static instance: Smtp;
    private smtpTransport: Transporter;

    private constructor() {

        log.info('smtp:init');

        // https://ethereal.email/create
        this.smtpTransport = nodemailer.createTransport(config.smtp);
        this.smtpTransport.on('error', (error) => log.error(`smtp:error: ${JSON.stringify(error)}`));

    }

    public static getInstance(): Smtp {

        if (!Smtp.instance) {
            Smtp.instance = new Smtp();
        }

        return Smtp.instance;

    }

    async verify(): Promise<void> {

        try {

            log.info('smtp:verify');

            if (!await this.smtpTransport.verify()) {
                this.close();
            }

        }
        catch (error) {

            log.error(`smtp:verify: ${JSON.stringify(error)}`);
            this.close();

        }

    }

    sendMail(to: any, subject: any, html: any): Promise<any> {

        if (config.smtp.auth) {
            return this.smtpTransport
                .sendMail({
                    from: config.smtp.auth.user,
                    to,
                    subject,
                    html
                });
        }

        return Promise.reject(new Error('Missing mail options'));

    }

    close(): void {

        log.info(`smtp:close`);
        this.smtpTransport.close();

    }

}

export const smtp = Smtp.getInstance();
