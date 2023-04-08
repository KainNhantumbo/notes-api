import {
  Request as IReq,
  Response as IRes,
  NextFunction as INext,
} from 'express';
import { config } from 'dotenv';
import { JsonWebTokenError } from 'jsonwebtoken';
import AppError from './app-error';
import EventLogger from './event-logger';

// loads environment variables
config();

export default class ErrorHandler {
  static genericHandler(err: AppError, res: IRes) {
    const { message, statusCode } = err;
    return res.status(statusCode).json({
      message,
      code: statusCode,
    });
  }

  static handler(error: Error | AppError, req: IReq, res: IRes, next: INext) {
    if (error instanceof AppError) return this.genericHandler(error, res);

    if (error.name == 'MongoServerError') {
      if (error.message.split(' ')[0] == 'E11000') {
        return res.status(409).json({
          status: 'Conflict Error',
          code: 409,
          message:
            'Data Confict Error: Some of the given information already exists on the server',
        });
      }
    }

    if (error.name === 'PayloadTooLargeError')
      return res.status(413).json({
        status: 'PayloadTooLargeError',
        code: 413,
        message: 'The file choosen is too large',
      });

    if (error instanceof JsonWebTokenError)
      return res.status(401).json({
        status: 'Authorization Error',
        code: 401,
        message: 'Unauthorized: invalid credentials.',
      });

    if (error.name == 'ValidationError') {
      const errorMessage = Object.values((error as any).errors)
        .map((obj: any) => obj.message)
        .join('. ');
      return res.status(400).json({
        status: 'Data Validation Error',
        code: 400,
        message: errorMessage,
      });
    }

    if (process.env.NODE_ENV == 'development') {
      console.log(
        `An uncaught error has ocurred: ${error.message}\t${error.stack}`
      );
      new EventLogger({
        message: error.stack || error.message,
        fileName: 'uncaught-errors.log',
      }).register();
    }

    res.status(500).json({
      status: 'Internal Server Error',
      code: 500,
      message:
        'An error occurred while processing your request. Please, try again later.',
    });
  }
}
