import * as mongoose from 'mongoose';
import { Model, Document, Schema } from 'mongoose';
import * as bcrypt from 'bcryptjs';
// custom
import { UserImage } from './user-image';

const Types = Schema.Types;

export interface UserDocument extends Document {
  email: string;
  password: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
  role: string;
  imageId?: any;
}

export interface UserModel extends Model<UserDocument> {
  authenticate(body: { email: string, password: string }): Promise<any>;
  isLoggedIn(id: string): Promise<any>;
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
userSchema.statics.authenticate = async function(body: { email: string, password: string }): Promise<any> {
  const user: UserModel = this as any;
  const { email, password } = body;
  const result = await user.findOne({ email })
    .select('email password role')
    .populate({
      path: 'imageId',
      model: UserImage,
      select: 'url'
    })
    .exec();

  if (result && await bcrypt.compareSync(password, result.password)) {
    return result;
  }
  else {
    return null;
  }

};

userSchema.statics.isLoggedIn = function(id: string): Promise<any> {

  const user: UserModel = this as any;

  return user.findById(id)
    .select('email role')
    .populate({
      path: 'imageId',
      model: UserImage,
      select: 'url'
    })
    .exec();

};



export const User = mongoose.model<UserDocument, UserModel>('User', userSchema);
