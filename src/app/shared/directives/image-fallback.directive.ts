// angular
import { Directive, Input, HostListener, ElementRef } from '@angular/core';

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

  constructor(private _eRef: ElementRef) { }

  @HostListener('error')
  loadFallbackOnError(): void {

    const element: HTMLImageElement = this._eRef.nativeElement as HTMLImageElement;
    console.log(element.src, this.appImageFallback)
    element.src = this.appImageFallback;

  }
}
