import { Schema } from 'mongoose';

export interface IUser {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  last_session: Date;
  settings: Schema.Types.ObjectId;
}

export interface INote {
  title: string;
  created_by: Schema.Types.ObjectId;
  content: string;
  metadata: {
    folder_id: Schema.Types.ObjectId;
    pinned: boolean;
    tags: { id: string; color: string; value: string }[];
    deleted: boolean;
    priority: string;
    status: string;
  };
}

export interface IFolder {
  name: string;
  created_by: Schema.Types.ObjectId;
  metadata: {
    color: string;
    favorite: boolean;
    tags: string[];
    deleted: boolean;
  };
}

export type TSettings = {
  created_by: Schema.Types.ObjectId;
  editor: {
    auto_save: {
      enabled: boolean;
      delay: number;
    };
    font: {
      font_size: number;
      line_height: number;
      font_family: string;
      font_weight: number;
    };
    editing: {
      line_numbers: boolean;
      enable_toolbar: boolean;
      enable_relative_line_numbers: boolean;
      tab_size: number
      highlight_active_line: boolean
    };
  };
  theme: {
    ui_theme: string;
    editor_theme: string;
    automatic_ui_theme: boolean;
  };
};
