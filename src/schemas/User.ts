import * as bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';

interface IUser {
  first_name: string;
  last_name: string;
  email: string;
  picture: { id: String; url: String };
  password: string;
  recovery_code: { code: string; date: string };
  subscription: { type: string; exp_date: string; issued_date: string };
}

const UserSchema = new Schema<IUser>(
  {
    first_name: {
      type: String,
      trim: true,
      required: [true, 'First name must be provided'],
      maxlength: [32, 'Provided first name is too long'],
    },
    last_name: {
      type: String,
      trim: true,
      required: [true, 'Last name must be provided.'],
      maxlength: [32, 'Provided last name is too long'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your e-mail adress'],
      trim: true,
      lowercase: true,
      match: [
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid e-mail adress',
      ],
      unique: true,
      maxlength: [64, 'Provided e-mail adress is too long'],
    },
    password: {
      type: String,
      minlength: [6, 'The password must have at least 6 characters'],
      required: [true, 'Please provide a password'],
    },
    recovery_code: {
      code: String,
      date: String,
    },
    picture: {
      id: String,
      url: String,
    },
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

const UserModel = model('User', UserSchema);
export default UserModel;
