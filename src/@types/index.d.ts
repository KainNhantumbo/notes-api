import { Application } from 'express';

export type AppProps = { app: Application; dbUri: string; port: number };

export type EventLoggerType = {
  message: string;
  fileName: string;
};
