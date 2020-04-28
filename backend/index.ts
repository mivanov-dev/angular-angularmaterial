import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import * as domino from 'domino';
import * as compression from 'compression';
import * as methodOverride from 'method-override';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as expressSession from 'express-session';
import * as passport from 'passport';
import * as cors from 'cors';
import 'express-validator';
const ms = require('ms');
// custom
import { config } from './config';
import { Smtp } from './smtp';
import { database } from './mongoose';
import { userRouter, sitemapRouter, robotsRouter } from './routes';
import { log } from './logger';

import { AppServerModule, ngExpressEngine, APP_BASE_HREF } from '../src/main.server';

// The Express app is exported so that it can be used by serverless Functions.
export const app = express();

const distFolder = path.join(process.cwd(), 'dist/browser');

const indexHtml = fs.existsSync(path.join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

// Our index.html we'll use as our template
const template = fs.readFileSync(path.join(distFolder, 'index.html'), { encoding: 'utf-8' }).toString();

const window: Window = domino.createWindow(template);

// @ts-ignore
global.window = window;
// @ts-ignore
global.document = window.document;
// @ts-ignore
global.particlesJS = window.particlesJS;
// @ts-ignore
global.Typed = window.Typed;
// @ts-ignore
// global.Image = window.Image;
global.Image = window.Image;

// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
app.engine('html', ngExpressEngine({ bootstrap: AppServerModule }));

app.set('view engine', 'html');
app.set('views', distFolder);

app.set('view engine', 'html');
app.set('port', +config.port);
app.set('host', config.host);
app.set('view cache', true);

app.use(compression());
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession(config.expressSessionOptions));
app.use(cors(config.corsOptions));
app.use(passport.initialize());
app.use(passport.session());

// Serve static files from /browser
app.get('*.*', express.static(distFolder, {
    maxAge: '1y'
}));

// All regular routes use the Universal engine
app.get('/', (req: Request, res: Response) => {

    res.render(indexHtml, {
        req, providers: [{
            provide: APP_BASE_HREF,
            useValue: req.baseUrl
        }]
    });

});

app.use((error: any, req: Request, res: Response, next: NextFunction): void => {

    if (!error.status) { log.error(error.stack); }
    res.status(error.status || 500).send({ message: error.message || 'Something broken!' });

});

app.use(userRouter);
app.use(sitemapRouter);
app.use(robotsRouter);

const smtp = Smtp.getInstance();
smtp.verify();

database(config.mongodb.uri);