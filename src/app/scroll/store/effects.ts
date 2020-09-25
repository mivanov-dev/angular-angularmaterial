// angular
import { Injectable } from '@angular/core';
// rxjs
import { of } from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';
// ngrx
import { Actions, ofType, createEffect } from '@ngrx/effects';
// custom
import * as CommentActions from './actions';
import { CommentService } from '../service/comment.service';

@Injectable()
export class CommentEffects {

    constructor(private actions$: Actions, private commentService: CommentService) { }

    addCommentsStart$ = createEffect(() => this.actions$
        .pipe(
            ofType(CommentActions.addCommentsStart),
            exhaustMap(() => this.commentService.getAll()
                .pipe(
                    map(({ comments }) => CommentActions.addComments({ comments })),
                    catchError((error) => of(CommentActions.addCommentsError({error: ''})))
                )
            )
        )
    );

}
