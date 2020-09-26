// angular
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
// cdk
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
// ngrx
import { Store } from '@ngrx/store';
// rxjs
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
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
export class CdkComponent implements OnInit, OnDestroy {

  offset = 1;
  batch = 10;
  comments$: Observable<Comment[]>;
  isLoading = false;
  isEnd = false;
  @ViewChild(CdkVirtualScrollViewport)
  viewport: CdkVirtualScrollViewport | undefined;
  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(private store$: Store<fromApp.AppState>) {

    this.comments$ = this.store$.select(fromComment.selectAllComments)
      .pipe(
        takeUntil(this.onDestroy$),
        tap((arr) => {

          if (arr.length === 0) {
            this.isEnd = true;
          }

          this.isEnd = false;

        })
      );


    this.store$.select(fromComment.selectLoading)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(res => this.isLoading = res);

  }
  ngOnInit(): void {

    this.isEnd = false;
    this.store$.dispatch(CommentActions.addCommentsStart({
      offset: (this.offset - 1) * this.batch,
      batch: this.batch
    }));

  }

  ngOnDestroy(): void {

    this.store$.dispatch(CommentActions.clearComments());
    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

  onScroll(event: any): void {

    if (this.isEnd) {
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
