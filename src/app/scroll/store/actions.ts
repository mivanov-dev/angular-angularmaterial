// ngrx
import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// custom
import { Comment } from './model';

export const loadComments = createAction(
  '[Comment] Load Comments',
  props<{ comments: Comment[] }>()
);

export const addComment = createAction(
  '[Comment] Add Comment',
  props<{ comment: Comment }>()
);

export const upsertComment = createAction(
  '[Comment] Upsert Comment',
  props<{ comment: Comment }>()
);

// Add Comments
export const addCommentsStart = createAction(
  '[Comment] Add Comments Start',
  props<{ offset: number, batch: number }>()
);
export const addComments = createAction(
  '[Comment] Add Comments',
  props<{ comments: Comment[] }>()
);
export const addCommentsError = createAction(
  '[Comment] Add Comments Error',
  props<{ error: any }>()
);

export const upsertComments = createAction(
  '[Comment] Upsert Comments',
  props<{ comments: Comment[] }>()
);

export const updateComment = createAction(
  '[Comment] Update Comment',
  props<{ comment: Update<Comment> }>()
);

export const updateComments = createAction(
  '[Comment] Update Comments',
  props<{ comments: Update<Comment>[] }>()
);

export const deleteComment = createAction(
  '[Comment] Delete Comment',
  props<{ id: string }>()
);

export const deleteComments = createAction(
  '[Comment] Delete Comments',
  props<{ ids: string[] }>()
);

export const clearComments = createAction(
  '[Comment] Clear Comments'
);
