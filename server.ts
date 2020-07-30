import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import 'core-js';
import * as http from 'http';
// custom
import { App } from './backend';
import { log } from './backend/logger';

export const { app } = App.getInstance();

function run(): void {

  function onError(error: any): void {
    log.error(`server:error ${JSON.stringify(error)}`);
  }

  function onListening(protocol: string, host: string, port: string): void {
    log.info(`Node Express server listening on ${protocol}://${host}:${port}`);
  }

  // Start up the Node server
  const httpServer = http.createServer(app);
  httpServer.listen(app.get('httpPort'));
  httpServer.on('listening', () => onListening('http', app.get('host'), app.get('httpPort')));
  httpServer.on('error', err => onError);

}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
