// angular
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
// material
import { MatIconRegistry } from '@angular/material/icon';
// custom
import { SeoService } from '@app/shared/services';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent {

  constructor(private _seoService: SeoService, private _matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer) {

    this._seoService.config({ title: 'Page not found', url: 'page-not-found' });

    this._matIconRegistry.addSvgIcon(
      'searching',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../assets/searching.svg')
    );

  }

}
