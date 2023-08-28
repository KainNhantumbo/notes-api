import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import User from '../models/User';
import Note from '../models/Note';
import Folder from '../models/Folder';
import AppError from '../lib/app-error';
import { randomUUID } from 'node:crypto';
import { cloudinaryAPI } from '../config/cloudnary';
import { validatePassword } from '../lib/validators';
import { Request as IReq, Response as IRes } from 'express';

dotenv.config(); // imports env variables

export default class UserController {
  async getUser(req: IReq, res: IRes): Promise<void> {
    const { id } = req.params;
    const defaultFields = '-password -last_session';
    const foundUser = await User.findOne({ _id: id })
      .select(defaultFields)
      .lean();
    if (!foundUser) throw new AppError('Erro: usuário não encontrado.', 404);
    res.status(200).json(foundUser);
  }

  async createUser(req: IReq, res: IRes): Promise<void> {
    const { password, email, ...data } = req.body;

    if (!password || String(password).length < 8)
      throw new AppError('Password must have at least 8 caracteres', 400);

    const validationResult = await validatePassword(String(password));
    if (validationResult === false)
      throw new AppError('Please use a strong password.', 400);

    if (Array.isArray(validationResult)) {
      const response: string = validationResult
        .map((obj) => obj?.message)
        .reduce((acc, current) => {
          const phrase = String.prototype.concat(acc, ' ', current);
          return phrase;
        }, '');

      throw new AppError(response, 400);
    }

    if (!email) throw new AppError('Coloque o seu e-mail', 400);

    // check for duplicates
    const existingUser = await User.exists({ email }).lean();
    if (existingUser)
      throw new AppError('A account with provided email already exists.', 409);

    await User.create({ ...data, password, email });
    res.sendStatus(201);
  }

  async updateUser(req: IReq, res: IRes): Promise<void> {
    let { user, ...userData } = req.body;
    const defaultFields = '-password -last_session';

    const { profileImageData, password, ...data } = userData;

    if (password) {
      if (String(password).length < 8)
        throw new AppError('Password must have at least 8 caracteres.', 400);

      const validationResult = await validatePassword(String(password));
      if (validationResult === false)
        throw new AppError('Please use a strong password.', 400);

      if (Array.isArray(validationResult)) {
        const response: string = validationResult
          .map((obj) => obj?.message)
          .reduce((acc, current) => {
            const phrase = String.prototype.concat(acc, ' ', current);
            return phrase;
          }, '');

        throw new AppError(response, 400);
      }

      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(password, salt);
    }

    if (profileImageData?.data) {
      if (process.env.NODE_ENV === 'development') {
        data.profile_image = {
          id: profileImageData.id || randomUUID(),
          url: profileImageData.data,
        };
      } else {
        let result = await cloudinaryAPI.uploader.upload(
          profileImageData.data,
          {
            public_id: profileImageData.id || undefined,
            folder: '/sales-api/users/account',
          }
        );
        data.profile_image = {
          id: result.public_id,
          url: result.secure_url,
        };
      }
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

  async deleteUser(req: IReq, res: IRes): Promise<void> {
    let { user } = req.body;

    await Folder.deleteMany({ created_by: user.id }).lean();
    await Note.deleteMany({ created_by: user.id }).lean();

    const deletedDoc = await User.findOneAndDelete({ _id: user.id }).lean();

    if (!deletedDoc)
      throw new AppError(
        'Failed to delete user account. Please try again later.',
        400
      );

    if (process.env.NODE_ENV !== 'development') {
      await cloudinaryAPI.uploader.destroy(deletedDoc.profile_image.id, {
        invalidate: true,
      });
    }
    res.sendStatus(204);
  }
}
