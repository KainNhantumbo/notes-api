import * as bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import { validateEmail } from '../lib/validators';
import type { IUser } from '../@types/models';

const UserSchema = new Schema<IUser>(
  {
    first_name: {
      type: String,
      trim: true,
      required: [true, 'First name must be provided'],
      maxlength: [32, 'First name field length is too long'],
    },
    last_name: {
      type: String,
      trim: true,
      required: [true, 'Last name must be provided.'],
      maxlength: [32, 'Last name field length is too long'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your e-mail adress'],
      trim: true,
      lowercase: true,
      validate: {
        validator: validateEmail,
        message: 'Please provide a valid email adress',
      },
      unique: true,
      maxlength: [64, 'E-mail adress field length is too long'],
    },
    password: {
      type: String,
      minlength: [6, 'The password must have at least 6 characters'],
      required: [true, 'Please provide a password'],
    },
    profile_image: { id: String, url: String },
    last_session: { type: Date, default: Date.now() },
    settings: { type: Schema.Types.ObjectId, ref: 'Settings' },
  },
  { timestamps: true }
);

//  hashing user password and recovery key
UserSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err: any) {
    next(err);
  }
});

const User = model('User', UserSchema);
export default User;
