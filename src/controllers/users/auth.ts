import * as bcrypt from 'bcrypt';
import AppError from '../../lib/app-error';
import UserModel from '../../schemas/User';
import { config } from 'dotenv';
import { Request as IReq, Response as IRes } from 'express';
import { verifyToken, createToken } from '../../lib/jwt-async-functions';

// loads process environment variables
config();

export default class AuthController {
  private userToken: string = 'userToken';

  async login(req: IReq, res: IRes): Promise<void> {
    const PROD_ENV = process.env.NODE_ENV === 'development' ? true : false;
    const { password, email } = req.body;
    if (!password || !email)
      throw new AppError('Please provide your e-mail and password.', 400);
    const foundUser = await UserModel.findOne({ email }).lean();
    if (!foundUser)
      throw new AppError(
        'Account not found. Please check your e-mail and try again.',
        404
      );
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match)
      throw new AppError('Wrong password. Please check and try again.', 401);
    const userId: any = foundUser._id;
    const accessToken = await createToken(
      userId,
      process.env.ACCESS_TOKEN || '',
      '10m'
    );
    const refreshToken = await createToken(
      userId,
      process.env.REFRESH_TOKEN || '',
      '14d'
    );
    res
      .status(200)
      .cookie(this.userToken, refreshToken, {
        httpOnly: true,
        secure: PROD_ENV && true,
        sameSite: 'strict',
        expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      })
      .json({ token: accessToken, userId });
  }

  async refresh(req: IReq, res: IRes): Promise<void> {
    const tokenCookie = req.cookies.userToken;
    if (!tokenCookie) throw new AppError('Unauthorized: Invalid token.', 401);
    const decodedPayload: any = await verifyToken(
      tokenCookie,
      process.env.REFRESH_TOKEN || ''
    );
    if (!decodedPayload) throw new AppError('Forbidden', 403);
    const user: any = await UserModel.findOne({ _id: decodedPayload.userId });
    if (!user) throw new AppError('Unauthorized: invalid token', 401);
    const accessToken = await createToken(
      user._id,
      process.env.ACCESS_TOKEN || '',
      '10m'
    );
    res.status(200).json({ token: accessToken, userId: user._id });
  }

  logout(req: IReq, res: IRes): IRes<any, Record<string, any>> | undefined {
    const PROD_ENV = process.env.NODE_ENV === 'development' ? true : false;
    const tokenCookie = req.cookies.userToken;
    if (!tokenCookie)
      return res.status(401).json({ message: 'Invalid cookie' });
    res
      .status(204)
      .clearCookie(this.userToken, {
        httpOnly: true,
        secure: PROD_ENV && true,
        sameSite: 'strict',
      })
      .json({ message: 'Cookie cleared.' });
  }
}
