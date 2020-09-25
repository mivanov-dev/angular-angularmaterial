import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { Comment } from '../model';
import * as CommentActions from '../actions';

export const key = 'comments';

export interface State extends EntityState<Comment> {
  loading: boolean;
  error: any;
}

export const adapter: EntityAdapter<Comment> = createEntityAdapter<Comment>({
  selectId: (c: Comment) => c.seq,
  sortComparer: (a: Comment, b: Comment) => a.seq - b.seq
});

export const initialState: State = adapter.getInitialState({
  loading: false,
  error: null
});

export const commentReducer = createReducer(
  initialState,
  on(CommentActions.addComment,
    (state, action) => adapter.addOne(action.comment, state)
  ),
  on(CommentActions.upsertComment,
    (state, action) => adapter.upsertOne(action.comment, state)
  ),
  // Add Comments
  on(CommentActions.addCommentsStart,
    (state) => ({
      ...state,
      loading: true
    })),
  on(CommentActions.addComments,
    (state, { comments }) => adapter.addMany(comments, {
      ...state,
      error: null,
      loading: false
    })
  ),
  on(CommentActions.addCommentsError,
    (state, { error }) => ({
      ...state,
      loading: false,
      error
    })),

  on(CommentActions.upsertComments,
    (state, action) => adapter.upsertMany(action.comments, state)
  ),
  on(CommentActions.updateComment,
    (state, action) => adapter.updateOne(action.comment, state)
  ),
  on(CommentActions.updateComments,
    (state, action) => adapter.updateMany(action.comments, state)
  ),
  on(CommentActions.deleteComment,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(CommentActions.deleteComments,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(CommentActions.loadComments,
    (state, action) => adapter.setAll(action.comments, state)
  ),
  on(CommentActions.clearComments,
    state => adapter.removeAll(state)
  ),
);

export const reducer = (state: State | undefined, action: Action) => {
  return commentReducer(state, action);
};
