import * as express from 'express';
import { Request, Response, NextFunction, Application, urlencoded } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import * as domino from 'domino';
import * as compression from 'compression';
import * as methodOverride from 'method-override';
import * as cookieParser from 'cookie-parser';
import * as expressSession from 'express-session';
import * as passport from 'passport';
import * as cors from 'cors';
import 'express-validator';
import * as _ from 'lodash';
const ms = require('ms');
// custom
import { config } from './config';
import { Smtp } from './smtp';
import { database } from './mongoose';
import { userRouter, sitemapRouter, robotsRouter } from './routes';
import { log } from './logger';
import { AppServerModule, ngExpressEngine, APP_BASE_HREF } from '../src/main.server';

const distFolder = path.join(process.cwd(), 'dist/browser');
const indexHtml = fs.existsSync(path.join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';
const template = fs.readFileSync(path.join(distFolder, 'index.html'), { encoding: 'utf-8' }).toString();
const window: Window = domino.createWindow(template);

// @ts-ignore
global.window = window;
// @ts-ignore
global.document = window.document;
// @ts-ignore
global.Typed = window.Typed;
// @ts-ignore
global.Image = window.Image;

export class App {

    private static instance: App;

    public app: Application = express();

    private constructor() {

        this.app.engine('html', ngExpressEngine({ bootstrap: AppServerModule }));

        this.app.set('view engine', 'html');
        this.app.set('views', distFolder);
        this.app.set('httpPort', +config.port);
        this.app.set('host', config.host);
        this.app.set('view cache', true);
        this.app.use(compression({
            memLevel: 9,
            level: 9
        }));
        this.app.use(methodOverride());
        this.app.use(express.json());
        this.app.use(urlencoded({ extended: false }));
        this.app.use(cookieParser());
        this.app.use(expressSession(config.expressSessionOptions));
        this.app.use(cors(config.corsOptions));
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        this.app.use(express.static(distFolder, {
            maxAge: ms('1d')
        }));
        this.app.use((error: any, req: Request, res: Response, next: NextFunction): void => {

            if (!error.status) {
                log.error(error.stack);
            }

            res.status(error.status || 500).send({ message: error.message || 'Something broken!' });

        });

        this.app.get('/', (req: Request, res: Response) => {

            res.render(indexHtml, {
                req, providers: [{
                    provide: APP_BASE_HREF,
                    useValue: req.baseUrl
                }]
            });

        });
        this.app.use(userRouter);
        this.app.use(sitemapRouter);
        this.app.use(robotsRouter);

        Smtp.getInstance().verify();

        database();

    }

    public static getInstance(): App {

        if (!App.instance) {
            App.instance = new App();
        }

        return App.instance;

    }

}
