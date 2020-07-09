import * as dotenv from 'dotenv';
import { SessionOptions } from 'express-session';
import * as SMTPTransport from 'nodemailer/lib/smtp-transport';
const ms = require('ms');

dotenv.config({ path: './.env', encoding: 'utf-8' });

export const config = {
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 4200,
    protocol: process.env.PROTOCOL = 'http',
    seoHost: process.env.SEO_HOST || this.host,
    seoPort: process.env.SEO_PORT || this.port,
    seoProtocol: process.env.SEO_PROTOCOL || this.protocol,
    mongodb: {
        uri: process.env.MONGODB_URI
    },
    cloudinary: {
        name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        env_var: process.env.CLOUDINARY_ENV_VAR,
        base_delivery_url: process.env.CLOUDINARY_BASE_DELIVERY_URL,
        secret_delivery_url: process.env.CLOUDINARY_SECRET_DELIVERY_URL,
        api_base_url: process.env.CLOUDINARY_API_BASE_URL
    },
    google: {
        client_id: process.env.GOOGLE_CLIENT_ID,
        project_id: process.env.GOOGLE_PROJECT_ID,
        auth_uri: process.env.GOOGLE_AUTH_URI,
        token_uri: process.env.GOOGLE_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uris: process.env.GOOGLE_REDIRECT_URIS,
        javascript_origins: process.env.GOOGLE_JAVASCRIPT_ORIGINS
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
        // rolling: true,
        resave: false,
        saveUninitialized: true
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
        host: process.env.SMTP_HOST,
        port: 587,
        auth: {
            user: process.env.SMTP_AUTH_USER,
            pass: process.env.SMTP_AUTH_PASS
        },
        logger: true,
        debug: true,
    } as SMTPTransport.Options
};
