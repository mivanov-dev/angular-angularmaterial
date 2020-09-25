// angular
import { Component, OnDestroy, OnInit} from '@angular/core';
// ngrx
import { Store } from '@ngrx/store';
// rxjs
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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

  comments$: Observable<Comment[]>;
  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(private store$: Store<fromApp.AppState>) {

    this.comments$ = this.store$.select(fromComment.selectAllComments).pipe(takeUntil(this.onDestroy$));

  }

  ngOnInit(): void {

    this.store$.dispatch(CommentActions.addCommentsStart());

  }

  ngOnDestroy(): void {

    this.store$.dispatch(CommentActions.clearComments());

    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

}
