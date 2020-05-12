import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import 'core-js';
import * as http from 'http';
import * as https from 'https';
import * as fs from 'fs';
// custom
import { app } from './backend';
import { log } from './backend/logger';

export { app };

function run() {

  function onError(error) {
    log.error(error);
  }

  function onListening(protocol, host, port) {
    log.info(`Node Express server listening on ${protocol}://${host}:${port}`);
  }

  // Start up the Node server
  const httpServer = http.createServer(app);
  httpServer.listen(app.get('httpPort'));
  httpServer.on('listening', () => onListening('http', app.get('host'), app.get('httpPort')));
  httpServer.on('error', err => onError);

  const httpsServer = https.createServer({
    key: fs.readFileSync('./certificates/server.key'),
    cert: fs.readFileSync('./certificates/server.crt')
  }, app);
  httpsServer.listen(app.get('httpsPort'));
  httpsServer.on('listening', () => onListening('https', app.get('host'), app.get('httpsPort')));
  httpsServer.on('error', err => onError);

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
