import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import 'core-js';
import * as http from 'http';
// custom
import { app } from './backend';
import { log } from './backend/logger';

export { app };

function run() {

  // Start up the Node server
  const httpServer = http.createServer(app);
  httpServer.listen(app.get('port'));
  httpServer.on('listening', () => log.info(`Node Express server listening on http://${app.get('host')}:${app.get('port')}`));
  httpServer.on('error', err => log.error(err));

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
