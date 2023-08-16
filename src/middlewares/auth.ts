import {
  Request as IReq,
  Response as IRes,
  NextFunction as INextFn,
} from 'express';
import AppError from '../lib/app-error';
import asyncWrapper from '../lib/async-wrapper';
import { config } from 'dotenv';
import { verifyToken } from '../lib/jwt-async-functions';

// loads environment variables
config();

export default function authenticate () {
  return asyncWrapper(
    async function (req: IReq, res: IRes, next: INextFn): Promise<void> {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer '))
        throw new AppError('Unauthorized: invalid token.', 401);
      const token = authHeader.split(' ')[1];
      const decodedPayload: any = await verifyToken(
        token,
        process.env.ACCESS_TOKEN || ''
      );
      if (!decodedPayload) throw new AppError('Invalid token.', 401);
      // inserts user id into request middleware
      req.body.user = decodedPayload.userId;
      next();
    }
  );
}
