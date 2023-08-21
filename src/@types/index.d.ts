import { Application } from 'express';
import { Response, Request, NextFunction } from 'express';

export type AppProps = { app: Application; dbUri: string; port: number };

export type TEventLogger = {
  message: string;
  fileName: string;
};

export type HandledFunctionType = (
	req: Request,
	res: Response,
	next: NextFunction
) => ControllerResponse;

