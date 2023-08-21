import mongoose from 'mongoose';
import { debug } from 'node:util';
import { log } from 'node:console';
import terminus from '@godaddy/terminus';
import type { AppProps } from '../@types/index';
import { Application } from 'express';

export default class Bootstrap {
  private readonly props: AppProps;

  constructor(props: AppProps) {
    this.props = props;
  }

  public async start(): Promise<void> {
    try {
      this.shutdown();
      await mongoose.connect(this.props.dbUri);
      this.props.app.listen(this.props.port, () => {
        log(`Server running... Port: ${this.props.port}`);
      });
    } catch (error) {
      console.error(error);
      process.exit(process.exitCode || 0);
    }
  }

  private shutdown(): Application {
    return terminus.createTerminus(this.props.app, {
      onSignal: async function () {
        try {
          await mongoose.disconnect();
        } catch (error) {
          console.error(error);
        }
      },
      beforeShutdown: async function () {
        debug('Signal received: closing HTTP server.');
      },
      onShutdown: async function () {
        log('Cleanup finished, server is shutting down.');
      },
      timeout: 15000,
      signals: ['SIGINT', 'SIGTERM'],
    });
  }
}
