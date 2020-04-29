// angular
import { Directive, Input, HostListener, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * We can use the directive like that.
 * Examples:
 * <img src="some_image_url" appImageFallback />
 * <img src="some_image_url" appImageFallback="image_url" />
 * <img src="some_image_url" [appImageFallback]="variable" />
 */
@Directive({
  selector: 'img[appImageFallback]'
})
export class ImageFallbackDirective {

  @Input() appImageFallback: string;

  constructor(private _eRef: ElementRef, @Inject(PLATFORM_ID) private _platformId) { }

  @HostListener('error')
  loadFallbackOnError(): void {

    if (isPlatformBrowser(this._platformId)) {
      const element: HTMLImageElement = this._eRef.nativeElement as HTMLImageElement;
      element.src = this.appImageFallback;
    }

  }
}
