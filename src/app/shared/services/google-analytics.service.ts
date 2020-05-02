// angular
import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
// rxjs
import { filter } from 'rxjs/operators';
// custom
import { environment } from '@env/environment';

declare var gtag;

@Injectable({ providedIn: 'root' })
export class GoogleAnalyticsService {

    constructor(private router: Router) {

        this.router.events
            .pipe(filter(res => res instanceof NavigationEnd))
            .subscribe((res: NavigationEnd) => {

                let options = { page_path: res.urlAfterRedirects };

                if (!environment.production) {
                    options = Object.assign({
                        _setDomainName: 'none',
                        cookieDomain: 'none',
                    }, options);
                }

                gtag('config', environment.google.analytics.id, options);

            });

    }

}
