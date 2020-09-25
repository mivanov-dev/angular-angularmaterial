import * as mongoose from 'mongoose';
import { Model, Document, Schema } from 'mongoose';

const Types = Schema.Types;

export interface CounterDocument extends Document {
    _id: string;
    seq: number;
}

export interface CounterModel extends Model<any> { }

export const counterSchema = new Schema({
    _id: {
        type: Types.String,
        required: true
    },
    seq: {
        type: Types.Number,
        default: 0
    }
}, {
    collection: 'counter',
    timestamps: { createdAt: 'createdAt' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

export const Counter = mongoose.model<CounterDocument, CounterModel>('Counter', counterSchema);
