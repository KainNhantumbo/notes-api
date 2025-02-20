import type { Schema } from 'mongoose';

export interface User {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  last_session: Date;
  settings: Schema.Types.ObjectId;
}

export interface Note {
  title: string;
  folder_id: string;
  created_by: Schema.Types.ObjectId;
  content: string;
  pinned: boolean;
  tags: { id: string; color: string; value: string }[];
  deleted: boolean;
  priority: string;
  status: string;
}

export interface Folder {
  name: string;
  created_by: Schema.Types.ObjectId;
  metadata: {
    color: string;
    favorite: boolean;
    tags: string[];
    deleted: boolean;
  };
}

export interface Settings {
  created_by: Schema.Types.ObjectId;
  theme: { scheme: string; is_automatic: boolean };
  editor: {
    auto_save: { enabled: boolean; delay: number };
    editing: { enable_toolbar: boolean };
    font: {
      font_size: number;
      line_height: number;
      font_family: string;
      font_weight: number;
    };
    toolbar: EditorTools;
  };
}

export type EditorTools = {
  undo: boolean;
  redo: boolean;
  bold: boolean;
  italic: boolean;
  headings: boolean;
  underline: boolean;
  strike: boolean;
  textAlign: boolean;
  highlight: boolean;
  image: boolean;
  superscript: boolean;
  subscript: boolean;
  code: boolean;
  paragraph: boolean;
  bulletList: boolean;
  orderedList: boolean;
  taskList: boolean;
  codeBlock: boolean;
  blockquote: boolean;
  horizontalRuler: boolean;
  hardBreak: boolean;
};
