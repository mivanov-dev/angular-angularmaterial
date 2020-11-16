import * as dotenv from 'dotenv';
import { SessionOptions } from 'express-session';
import * as SMTPTransport from 'nodemailer/lib/smtp-transport';
import { RedisOptions } from 'ioredis';
const ms = require('ms');

dotenv.config({ path: './.env', encoding: 'utf-8' });

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 4200;
const protocol = process.env.PROTOCOL = 'http';

export const config = {
    host,
    port,
    protocol,
    seoHost: process.env.SEO_HOST || host,
    seoPort: process.env.SEO_PORT || port,
    seoProtocol: process.env.SEO_PROTOCOL || protocol,
    mongodb: {
        uri: process.env.MONGODB_URI as string,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    },
    google: {
        client_id: process.env.GOOGLE_CLIENT_ID as string,
        project_id: process.env.GOOGLE_PROJECT_ID as string,
        auth_uri: process.env.GOOGLE_AUTH_URI as string,
        token_uri: process.env.GOOGLE_TOKEN_URI as string,
        auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL as string,
        client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
        redirect_uris: process.env.GOOGLE_REDIRECT_URIS as string,
        javascript_origins: process.env.GOOGLE_JAVASCRIPT_ORIGINS as string
    },
    expressSessionOptions: {
        cookie: {
            httpOnly: true,
            // maxAge: ms("1m"),
            secure: false,
            sameSite: true,
            path: '/',
            signed: false,
            encode: decodeURI,
        },
        name: 'uid',
        secret: 'secretKey',
        rolling: false,
        resave: false,
        saveUninitialized: false
    } as SessionOptions,

    corsOptions: {
        allowedHeaders: [
            'Access-Control-*',
            'Access-Control-Allow-Credentials',
            'Access-Control-Allow-Origin',
            'Origin',
            'X-Requested-With',
            'Content-Type',
            'Accept',
            'Set-Cookie',
            'Cookie',
            'X-Forwarded-Proto'],
        credentials: true,
        maxAge: ms('1d'),
        methods: ['GET', 'PUT', 'POST', 'HEAD', 'PATCH'],
        optionsSuccessStatus: 200,
        origin: true
    },
    smtp: {
        host: process.env.SMTP_HOST as string,
        port: 587,
        auth: {
            user: process.env.SMTP_AUTH_USER as string,
            pass: process.env.SMTP_AUTH_PASS as string
        },
        logger: true,
        debug: true,
    } as SMTPTransport.Options,
    redis: {
        host: process.env.REDIS_HOST as string,
        port: process.env.REDIS_PORT
    } as RedisOptions
};
