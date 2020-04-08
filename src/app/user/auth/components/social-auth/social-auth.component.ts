// angular
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-social',
  templateUrl: './social-auth.component.html',
  styleUrls: ['./social-auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialAuthComponent {

  @Input('isLoading') isLoading: boolean;

  constructor(private _iconRegistry: MatIconRegistry, private _domSanitizer: DomSanitizer) {

    this._iconRegistry.addSvgIcon('google', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/google-icon.svg'));
    this._iconRegistry.addSvgIcon('facebook', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/facebook-icon.svg'));

  }

}
