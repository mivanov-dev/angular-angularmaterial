import * as mongoose from 'mongoose';
import { Model, Document, Schema } from 'mongoose';

import { Counter } from './counter';

const Types = Schema.Types;

export interface CommentDocument extends Document {
  emoji: string;
  author: string;
  description: string;
  seq: number;
}

export interface CommentModel extends Model<CommentDocument> { }

export const commentSchema = new Schema({
  emoji: {
    type: Types.String,
  },
  author: {
    type: Types.String,
  },
  description: {
    type: Types.String,
  },
  seq: {
    type: Types.Number,
    default: 0
  }
}, {
  collection: 'comment',
  timestamps: { createdAt: 'createdAt' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

commentSchema.pre<CommentDocument>('save', function(this: CommentDocument, next): void {
  const comment = this;


  // @ts-ignore
  Counter.findByIdAndUpdate({ _id: 'commentId' }, { $inc: { seq: 1 }, }, (error, counter): void => {
    if (error) {
      return next(error);
    }

    if (counter) {
      comment.seq = counter.seq;
    }

    next();
  });

});

export const Comment = mongoose.model<CommentDocument>('Comment', commentSchema) as CommentModel;
