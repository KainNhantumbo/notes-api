import { Schema } from 'mongoose';

export interface IUser {
  first_name: string;
  last_name: string;
  email: string;
  profile_image: { id: string; url: string };
  password: string;
  last_session: Date;
}

export interface INote {
  name: string;
  description: string;
  content: {
    time?: number;
    version?: string;
    blocks: Array<{
      id?: string | undefined;
      type: string;
      data: any;
      tunes?: { [name: string]: any };
    }>;
  };
  metadata: {
    folder: Schema.Types.ObjectId;
    color: string;
    favorite: boolean;
    reminder: { time: Date; expired: boolean };
    tags: string[];
  };
}

export interface IFolder {
  name: string;
  metadata: {
    color: string;
    favorite: boolean;
    tags: string[];
  };
}
