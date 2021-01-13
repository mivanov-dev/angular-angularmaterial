// angular
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
// cdk
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
// ngrx
import { Store } from '@ngrx/store';
// rxjs
import { Observable, Subject } from 'rxjs';
import { skip, takeUntil } from 'rxjs/operators';
// custom
import * as fromApp from '../../store';
import * as fromComment from '../store/reducer';
import * as CommentActions from '../store/actions';
import { Comment } from '../store/model';
import { SeoService } from '@app/shared/services';

@Component({
  selector: 'app-scroll-cdk',
  templateUrl: './cdk.component.html',
  styleUrls: ['./cdk.component.scss']
})
export class CdkComponent implements OnInit, OnDestroy {

  offset = 1;
  batch = 10;
  isLoading = false;
  hasMore?: boolean;
  @ViewChild(CdkVirtualScrollViewport)
  viewport: CdkVirtualScrollViewport | undefined;
  private onDestroy$: Subject<void> = new Subject<void>();

  get comments$(): Observable<Comment[]> {

    return this.store$.select(fromComment.selectAllComments)
      .pipe(takeUntil(this.onDestroy$));

  }

  constructor(private store$: Store<fromApp.AppState>,
              private seoService: SeoService) {

    this.seoService.config({ title: 'Scroll/Cdk', url: 'scroll/cdk' });

  }

  ngOnInit(): void {

    this.addComments();
    this.subscribeHasMore();
    this.subscribeLoading();

  }

  ngOnDestroy(): void {

    this.store$.dispatch(CommentActions.clearComments());
    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

  onScroll(event: any): void {

    if (!this.hasMore && (this.hasMore !== undefined)) {
      return;
    }

    const end = this.viewport?.getRenderedRange().end;
    const total = this.viewport?.getDataLength();

    if (end === total && !this.isLoading) {
      this.offset += 1;
      this.store$.dispatch(CommentActions.addCommentsStart({
        offset: (this.offset - 1) * this.batch,
        batch: this.batch
      }));

    }

  }

  trackByIdx(i: any): any {
    return i;
  }

  private subscribeHasMore(): void {

    this.store$.select(fromComment.selectHasMore)
      .pipe(takeUntil(this.onDestroy$), skip(1))
      .subscribe(res => this.hasMore = res);

  }

  private subscribeLoading(): void {

    this.store$.select(fromComment.selectLoading)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(res => this.isLoading = res);

  }

  private addComments(): void {

    this.store$.dispatch(CommentActions.addCommentsStart({
      offset: (this.offset - 1) * this.batch,
      batch: this.batch
    }));

  }

}
