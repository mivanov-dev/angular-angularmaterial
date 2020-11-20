// angular
import { Component, OnDestroy, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-scroll-cdk',
  templateUrl: './cdk.component.html',
  styleUrls: ['./cdk.component.scss']
})
export class CdkComponent implements OnDestroy {

  offset = 1;
  batch = 10;
  comments$: Observable<Comment[]>;
  isLoading = false;
  hasMore?: boolean;
  @ViewChild(CdkVirtualScrollViewport)
  viewport: CdkVirtualScrollViewport | undefined;
  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(private store$: Store<fromApp.AppState>) {

    this.store$.dispatch(CommentActions.addCommentsStart({
      offset: (this.offset - 1) * this.batch,
      batch: this.batch
    }));

    this.comments$ = this.store$.select(fromComment.selectAllComments)
      .pipe(takeUntil(this.onDestroy$));

    this.store$.select(fromComment.selectHasMore)
      .pipe(takeUntil(this.onDestroy$), skip(1))
      .subscribe(res => this.hasMore = res);


    this.store$.select(fromComment.selectLoading)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(res => this.isLoading = res);

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

}
