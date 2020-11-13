// angular
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// custom
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// function loadServiceWorker(): void {
//   if ('serviceWorker' in navigator && environment.production) {
//     navigator.serviceWorker.register('/ngsw-worker.js')
//       .catch((error) => console.error('Service worker registration failed with:', error));
//   }
// }

document.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    // .then(() => loadServiceWorker())
    .catch((error) => console.error(error));
});
