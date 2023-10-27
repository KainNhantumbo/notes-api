import mongoose from 'mongoose';
import { debug } from 'node:util';
import { info } from 'node:console';
import terminus from '@godaddy/terminus';
import type { AppProps } from '../types';
import swaggerDocs from '../lib/swagger';
import { notFoundRoute } from '../routes/404';
import ErrorHandler from '../lib/error-handler';

export default class Bootstrap {
  private readonly props: AppProps;

  constructor(props: AppProps) {
    this.props = props;
  }

  async start() {
    try {
      this.shutdown();
      await mongoose.connect(this.props.dbUri);
      this.props.app.listen(this.props.port, () => {
        info(`Server running... Port: ${this.props.port}`);
        swaggerDocs(this.props.app, this.props.port);

        // error handlers
        this.props.app.use(notFoundRoute);
        this.props.app.use(ErrorHandler.handler);
      });
    } catch (error) {
      console.error(error);
      process.exit(process.exitCode || 0);
    }
  }

  private shutdown() {
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
        info('Cleanup finished, server is shutting down.');
      },
      timeout: 15000,
      signals: ['SIGINT', 'SIGTERM']
    });
  }
}
