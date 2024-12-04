import { Server, IncomingMessage, ServerResponse } from 'node:http';
import { Application, Response, Request, NextFunction } from 'express';

export type CurrentServer = Server<
  typeof IncomingMessage,
  typeof ServerResponse
>;

export type AppProps = { app: Application; dbUri: string; port: number };

export type TEventLogger = {
  message: string;
  fileName: string;
};

export type LoggerProps = { message: string; fileName: string };

export type HandledFunctionType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<unknown>;

export type ValidatorResponse = { status: boolean; message: string };

export type { Response as IRes, Request as IReq, NextFunction as INext };

export type DecodedPayload = { id: string } | null | undefined;
