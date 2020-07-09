// angular
import { Injectable } from '@angular/core';
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

    constructor(private title: Title, private meta: Meta) { }


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

        const origin = `${environment.seoProtocol}://${environment.seoHost}:${environment.seoPort}`;
        const url = `${origin}/#/${seo.url}`;
        const title = `${seo.title} | AngularAngularMaterial`;
        const descriptionContent = 'This angular project is with test purpose here I\'ll test some angular techniques and libraries 👨‍💻☕';

        this.title.setTitle(title);
        this.title.getTitle();

        this.meta.updateTag({ property: 'og:url', content: url });
        this.meta.updateTag({ property: 'og:title', content: title });
        this.meta.updateTag({ property: 'og:type', content: 'website' });
        this.meta.updateTag({ property: 'og:site_name', content: 'AngularAngularMaterial' });
        this.meta.updateTag({ property: 'og:image', content: `${origin}/assets/icons/icon-192x192.png` });
        this.meta.updateTag({ property: 'og:description', content: descriptionContent });

        this.meta.updateTag({ name: 'twitter:url', content: url });
        this.meta.updateTag({ name: 'twitter:title', content: title });
        this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
        this.meta.updateTag({ name: 'twitter:site', content: '@AngularAngularMaterial' });
        this.meta.updateTag({ name: 'twitter:creator', content: '@AngularAngularMaterial' });
        this.meta.updateTag({ name: 'twitter:image', content: `${origin}/assets/icons/icon-192x192.png` });
        this.meta.updateTag({ name: 'twitter:description', content: descriptionContent });

        this.meta.updateTag({ name: 'description', content: descriptionContent });
        this.meta.updateTag({ name: 'keywords', content: 'angular' });
        this.meta.updateTag({ name: 'author', content: 'm.ivanov@email.com' });

    }

}
