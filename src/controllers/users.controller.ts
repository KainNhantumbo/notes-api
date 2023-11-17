import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import User from '../models/User';
import Note from '../models/Note';
import Settings from '../models/Settings';
import Folder from '../models/Folder';
import AppError from '../utils/app-error';
import { validatePassword } from '../utils/validators';
import { Request as IReq, Response as IRes } from 'express';

dotenv.config(); // imports env variables

export default class UserController {
  async getUser(req: IReq, res: IRes) {
    const { user } = req.body;
    const foundUser = await User.findOne({ _id: user.id })
      .select('-password -last_session')
      .lean();
    if (!foundUser)
      throw new AppError('Requested user account was not found.', 404);
    res.status(200).json(foundUser);
  }

  async createUser(req: IReq, res: IRes) {
    const { password, email, ...data } = req.body;

    if (!password || String(password).length < 8)
      throw new AppError('Password must have at least 8 characters', 400);

    const validationResult = await validatePassword(String(password));
    if (validationResult === false)
      throw new AppError(
        'Please use a strong password that contains at least 2 special characters.',
        400
      );

    if (Array.isArray(validationResult) && validationResult.length > 0) {
      const response: string = validationResult
        .map((obj) => obj?.message)
        .reduce((acc, current) => {
          const phrase = String.prototype.concat(acc, ' ', current);
          return phrase;
        }, '');

      throw new AppError(response, 400);
    }

    if (!email)
      throw new AppError('Please type your account email adress', 400);

    // check for duplicates
    const existingUser = await User.exists({ email }).lean();
    if (existingUser)
      throw new AppError('A account with provided email already exists.', 409);

    const createdUser = await User.create({ ...data, password, email });

    // creates a settings store object on database for the user
    await Settings.create({ created_by: createdUser._id });
    res.sendStatus(201);
  }

  async updateUser(req: IReq, res: IRes) {
    let { user, ...userData } = req.body;
    const defaultFields = '-password -last_session';

    const { password, ...data } = userData;

    if (password) {
      const validationResult = await validatePassword(String(password));
      if (validationResult === false)
        throw new AppError(
          'Please use a strong password that contains at least 2 special characters.',
          400
        );

      if (Array.isArray(validationResult) && validationResult.length > 0) {
        const response: string = validationResult
          .map((obj) => obj?.message)
          .reduce((acc, current) => {
            const phrase = acc.concat(' ', current);
            return phrase;
          }, '');

        throw new AppError(response, 400);
      }

      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(password, salt);
    }

    const updatedDoc = await User.findOneAndUpdate(
      { _id: user.id },
      { ...data },
      { runValidators: true, new: true }
    )
      .select(defaultFields)
      .lean();
    if (!updatedDoc) throw new AppError('Error: failed to update data', 403);
    res.status(200).json({ ...updatedDoc });
  }

  async deleteUser(req: IReq, res: IRes) {
    let { user } = req.body;
    await Folder.deleteMany({ created_by: user.id }).lean();
    await Note.deleteMany({ created_by: user.id }).lean();
    await Settings.deleteOne({ created_by: user.id }).lean();

    const deletedDoc = await User.findOneAndDelete({ _id: user.id }).lean();

    if (!deletedDoc)
      throw new AppError(
        'Failed to delete your account. Please, try again later.',
        400
      );
    res.sendStatus(204);
  }
}
