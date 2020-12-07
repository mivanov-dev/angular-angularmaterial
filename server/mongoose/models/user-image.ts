import * as mongoose from 'mongoose';
import { Model, Schema, Document } from 'mongoose';

const Types = Schema.Types;

export interface UserImageDocument extends Document {
  url: string;
}

export interface UserImageModel extends Model<UserImageDocument> { }

export const userImageSchema = new Schema({
  url: {
    type: Types.String,
  }
}, {
  collection: 'userImage',
  timestamps: { createdAt: 'createdAt' },
});

export const UserImage = mongoose.model<UserImageDocument, UserImageModel>('UserImage', userImageSchema);
