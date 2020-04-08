// angular
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
// rxjs
import { } from 'rxjs/operators';
// custom
import { environment } from 'src/environments/environment';

interface SeoModel {
    title: string;
    url: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {

    htmlMetaElement: HTMLMetaElement[] = [];

    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _title: Title,
        private _meta: Meta) { }


    // getTitle(): void {
    //     const APP_TITLE = this._title.getTitle();
    //     this._router
    //         .events.pipe(
    //             filter(event => event instanceof NavigationEnd),
    //             map(() => {
    //                 const CHILD = this._activatedRoute.firstChild;
    //                 if (CHILD.snapshot.data['title']) {
    //                     return CHILD.snapshot.data['title'];
    //                 }
    //                 return APP_TITLE;
    //             })
    //         ).subscribe((title: string) => this._title.setTitle(title));
    // }

    // getMeta(): void {

    //     this._router
    //         .events.pipe(
    //             filter(event => event instanceof NavigationEnd),
    //             map(() => {
    //                 const CHILD = this._activatedRoute.firstChild;
    //                 if (CHILD.snapshot.data['meta']) {
    //                     return CHILD.snapshot.data['meta'];
    //                 }
    //                 return {};
    //             })
    //         ).subscribe((meta: []) => {
    //             if (this.htmlMetaElement.length == 0) {
    //                 this.htmlMetaElement = this._meta.addTags(meta);
    //             }
    //             else {
    //                 this.htmlMetaElement.forEach(e => this._meta.removeTagElement(e));
    //                 this.htmlMetaElement = this._meta.addTags(meta);
    //             }
    //         });

    // }



    config(seo: SeoModel): void {

        const url = environment.appUrl + '/#/' + seo.url;
        const title = seo.title + ' | AngularAngularMaterial';
        const descriptionContent = 'This angular application is with test purpose, here we test all angular technics.';

        this._title.setTitle(title);
        this._title.getTitle();

        this._meta.updateTag({ property: 'og:url', content: url });
        this._meta.updateTag({ property: 'og:title', content: title });
        this._meta.updateTag({ property: 'og:type', content: 'website' });
        this._meta.updateTag({ property: 'og:site_name', content: 'AngularAngularMaterial' });
        this._meta.updateTag({ property: 'og:image', content: `${environment.appUrl}/assets/icons/icon-192x192.png` });
        this._meta.updateTag({ property: 'og:description', content: descriptionContent });

        this._meta.updateTag({ name: 'twitter:title', content: title });
        this._meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
        this._meta.updateTag({ name: 'twitter:site', content: '@AngularAngularMaterial' });
        this._meta.updateTag({ name: 'twitter:creator', content: '@AngularAngularMaterial' });
        this._meta.updateTag({ name: 'twitter:image', content: `${environment.appUrl}/assets/icons/icon-192x192.png` });

        this._meta.updateTag({ name: 'description', content: descriptionContent })

    }

}