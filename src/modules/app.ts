import { Application } from 'express';
import mongoose from 'mongoose';

type AppProps = { app: Application; dbUri: string; port: number };

export default class Bootstrap {
  private readonly props: AppProps;

  constructor(props: AppProps) {
    this.props = props;
  }

  async start(): Promise<void> {
    try {
      await mongoose.connect(this.props.dbUri);
      console.log(`Server already running on port ${this.props.port}`);
    } catch (error) {
      console.error(error);
    }
  }
}
