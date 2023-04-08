import type { AppProps } from '../@types/index';
import mongoose from 'mongoose';

export default class Bootstrap {
  private readonly props: AppProps;
  constructor(props: AppProps) {
    this.props = props;
  }

  async start(): Promise<void> {
    try {
      await mongoose.connect(this.props.dbUri);
      this.props.app.listen(this.props.port, () => {
        console.log(`Server running... Port: ${this.props.port}`);
      });
    } catch (error) {
      console.error(error);
      process.exit(process.exitCode);
    }
  }
}
