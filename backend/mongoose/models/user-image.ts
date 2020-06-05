import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

const Types = Schema.Types;

export interface IUserImageDocument extends mongoose.Document {
    url: string;
}

export const userImageSchema = new Schema({
    url: {
        type: Types.String,
    }
}, {
    collection: 'userImage',
    timestamps: { createdAt: 'createdAt' },
});

export const UserImage = mongoose.model<IUserImageDocument>('UserImage', userImageSchema);
