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

  @Input() appImageFallback?: string;

  constructor(private elementRef: ElementRef,
              @Inject(PLATFORM_ID) private platformId: any) { }

  @HostListener('error')
  loadFallbackOnError(): void {

    if (isPlatformBrowser(this.platformId) && this.appImageFallback) {
      const element: HTMLImageElement = this.elementRef.nativeElement as HTMLImageElement;
      element.src = this.appImageFallback;
    }

  }
}
