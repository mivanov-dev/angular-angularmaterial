// angular
import {
  Directive, Input, ElementRef,
  AfterViewInit, OnDestroy
} from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

/* istanbul ignore next */
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
export class ImageFallbackDirective implements AfterViewInit, OnDestroy {

  @Input() appImageFallback?: string;
  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(): void {

    const img: HTMLImageElement = this.elementRef.nativeElement as HTMLImageElement;

    fromEvent(img, 'error')
      .pipe(takeUntil(this.onDestroy$), distinctUntilChanged())
      .subscribe((res) => {

        if (this.appImageFallback) {
          img.src = this.appImageFallback;
        }

      });

  }

  ngOnDestroy(): void {

    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

}
