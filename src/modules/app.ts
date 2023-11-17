import mongoose from 'mongoose';
import swaggerUI from 'swagger-ui-express'
import type { AppProps, CurrentServer, IReq, IRes } from '../types';
import { notFoundRoute } from '../routes/404';
import ErrorHandler from '../utils/error-handler';
import Logger from '../utils/logger';
import swaggerSpec from '../docs/swagger.json'

export default class Bootstrap {
  private readonly props: AppProps;

  constructor(props: AppProps) {
    this.props = props;
    this.start();
  }

  private async start() {
    try {
      await mongoose.connect(this.props.dbUri);
      const serverInstance = this.props.app.listen(this.props.port, () => {
        Logger.info(`Server running... Port: ${this.props.port}`);
        this.serveDocs();

        this.props.app.use(notFoundRoute);
        this.props.app.use(ErrorHandler.handler);
      });

      this.shutdown(serverInstance);
    } catch (error) {
      console.error(error);
      process.exit(process.exitCode || 0);
    }
  }

  private async shutdown(server: CurrentServer) {
    const signals = ['SIGINT', 'SIGTERM'];

    try {
      for (const signal of signals) {
        process.on(signal, () => {
          Logger.info(`${signal} received: closing HTTP server.`);
          server.close(() => {
            Logger.info('Cleanup finished, server is shutting down.');
          });
        });
      }
    } catch (error) {
      console.error(error);
      process.exit(process.exitCode || 1);
    }
  }

  private serveDocs() {
    this.props.app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

    this.props.app.get('/docs-json', (req: IReq, res: IRes) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerSpec);
    });

    Logger.info(
      `API Documentation: http://localhost:${this.props.port}/docs`
    );
  }
}
