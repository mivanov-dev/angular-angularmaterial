import * as mongoose from 'mongoose';
import { Model, Document, Schema } from 'mongoose';
import * as bcrypt from 'bcryptjs';
// custom

const Types = Schema.Types;

export interface UserDocument extends Document {
  email: string;
  password: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
  role: string;
  is2FAenabled?: boolean;
  tfaSecret?: string;
  imageId?: any;
}

export interface UserModel extends Model<UserDocument> {
  isComparedPasswords(password: string, userPassword: string): Promise<boolean>;
}

export const userSchema = new Schema({
  email: {
    type: Types.String,
    unique: true,
    required: [true, 'Email is required !'],
    minlength: [10, 'Email length must be between 10 and 100 characters!'],
    maxlength: [100, 'Email length must be between 10 and 100 characters!'],
  },
  password: {
    type: Types.String,
    required: [true, 'Password is required !'],
    minlength: [10, 'Password length must be between 10 and 100 characters!'],
    maxlength: [100, 'Password length must be between 10 and 100 characters!']
  },
  resetPasswordToken: {
    type: Types.String,
  },
  resetPasswordExpires: {
    type: Types.Number,
  },
  role: {
    type: Types.String,
    default: 'user',
    required: true
  },
  is2FAenabled: {
    type: Types.Boolean,
    default: false,
    required: false
  },
  tfaSecret: {
    type: Types.String,
    default: '',
    required: false
  },
  imageId: {
    type: Types.ObjectId,
    ref: 'UserImage'
  },
}, {
  collection: 'user',
  timestamps: { createdAt: 'createdAt' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

userSchema.index({ email: 'text' }, { name: 'email_text', background: true });
userSchema.index({ email: 1 }, { unique: true, background: true });
userSchema.index({ imageId: 1 }, { background: true });

// Triggers

// Methods

// Statics
userSchema.statics.isComparedPasswords = async (password: string, userPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, userPassword);
};



export const User = mongoose.model<UserDocument>('User', userSchema) as UserModel;
