import {
  Request as IReq,
  Response as IRes,
  NextFunction as INext,
} from 'express';
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { appendFile, mkdir } from 'node:fs/promises';
import type { TEventLogger } from '../types/index';

export default class EventLogger {
  private readonly date: string = new Date().toISOString();
  private readonly fileName: string;
  private readonly message: string;

  constructor(props: TEventLogger) {
    this.fileName = props.fileName;
    this.message = props.message;
  }

  async register() {
    const LOG = `${this.date}\t${randomUUID()}\t${this.message}\n\n\n`;
    try {
      if (!existsSync(join(__dirname, '..', 'logs'))) {
        await mkdir(join(__dirname, '..', 'logs'));
      }
      await appendFile(join(__dirname, '..', 'logs', this.fileName), LOG);
    } catch (err) {
      console.error(err);
    }
  }

  logger(req: IReq, res: IRes, next: INext) {
    this.register();
    console.log(`${req.method}\t${req.path}\t${req.url} `);
    next();
  }
}
