import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import AppError from '../lib/app-error';
import User from '../models/User';
import { Request as IReq, Response as IRes } from 'express';
import { verifyToken, createToken } from '../lib/jwt-async-functions';

dotenv.config(); // imports env variables

export default class AuthController {
  async defaultLogin(req: IReq, res: IRes) {
    const PROD_ENV: boolean =
      process.env.NODE_ENV === 'development' ? false : true;

    const { password, email } = req.body;
    if (!password || !email)
      throw new AppError('Provide your e-mail and password', 400);

    const foundUser = await User.findOne({ email }).lean();

    if (!foundUser) throw new AppError('Account not found.', 404);

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match)
      throw new AppError('Wrong password. Please check and try again.', 403);

    // updates the user session time
    await User.updateOne(
      { _id: foundUser._id },
      { last_session: Date.now() }
    ).lean();

    if (!process.env.ACCESS_TOKEN || !process.env.REFRESH_TOKEN)
      throw new AppError('Server error: cannot access server token keys.', 500);

    if (!process.env.ACCESS_TOKEN_EXPDATE || !process.env.REFRESH_TOKEN_EXPDATE)
      throw new AppError(
        'Server error: cannot access server default token expiration time.',
        500
      );

    const accessToken = await createToken(
      { id: String(foundUser._id) },
      process.env.ACCESS_TOKEN,
      process.env.ACCESS_TOKEN_EXPDATE
    );
    const refreshToken = await createToken(
      { id: String(foundUser._id) },
      process.env.REFRESH_TOKEN,
      process.env.REFRESH_TOKEN_EXPDATE
    );

    res
      .status(200)
      .cookie('userToken', refreshToken, {
        httpOnly: true,
        secure: PROD_ENV && true,
        sameSite: 'strict',
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      })
      .json({
        id: String(foundUser._id),
        token: accessToken,
        email: foundUser.email,
        name: `${foundUser.first_name} ${foundUser.last_name}`,
      });
  }

  async refresh(req: IReq, res: IRes) {
    const tokenCookie = req.cookies.userToken;
    if (!tokenCookie)
      throw new AppError('Access denied: invalid credentials.', 401);

    const decodedPayload: any = await verifyToken(
      tokenCookie,
      process.env.REFRESH_TOKEN || ''
    );
    if (!decodedPayload) throw new AppError('Access denied: forbidden.', 403);

    const foundUser = await User.findOne({ _id: decodedPayload.id });

    if (!foundUser)
      throw new AppError('Access denied: invalid credentials', 401);

    if (!process.env.ACCESS_TOKEN)
      throw new AppError('Server error: cannot access server token keys.', 500);

    if (!process.env.ACCESS_TOKEN_EXPDATE)
      throw new AppError(
        'Server error: cannot access server default token expiration time.',
        500
      );

    const accessToken = await createToken(
      { id: String(foundUser._id) },
      process.env.ACCESS_TOKEN,
      process.env.ACCESS_TOKEN_EXPDATE
    );

    res.status(200).json({
      id: String(foundUser._id),
      token: accessToken,
      email: foundUser.email,
      name: `${foundUser.first_name} ${foundUser.last_name}`,
    });
  }

  async logout(req: IReq, res: IRes) {
    const tokenCookie = req.cookies.userToken;
    const PROD_ENV = process.env.NODE_ENV === 'development' ? false : true;
    if (!tokenCookie)
      throw new AppError('Access denied: invalid credentials.', 401);
    res
      .status(204)
      .clearCookie('userToken', {
        httpOnly: true,
        secure: PROD_ENV && true,
        sameSite: 'strict',
      })
      .json({ message: 'Logout successful.' });
  }
}
