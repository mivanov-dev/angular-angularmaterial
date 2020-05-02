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

  @Input() isLoading: boolean;

  constructor(private iconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {

    this.iconRegistry.addSvgIcon('google', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/google-icon.svg'));
    this.iconRegistry.addSvgIcon('facebook', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/facebook-icon.svg'));

  }

}
