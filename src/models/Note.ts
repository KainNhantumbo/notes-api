import { Schema, model } from 'mongoose';
import { INote } from '../@types/models';

const NoteSchema = new Schema<INote>(
  {
    title: {
      type: String,
      maxlength: [128, 'Title field is too long'],
      default: 'Untitled',
    },
    created_by: { type: Schema.Types.ObjectId, ref: 'User' },
    content: {
      type: String,
      required: [true, 'Plese write a content to your note before saving'],
    },
    metadata: {
      folder_id: { type: Schema.Types.ObjectId, ref: 'Folder' },
      color: { type: String, default: '' },
      favorite: { type: Boolean, default: false },
      tags: [{ type: String }],
      reminder: {
        time: { type: Date, default: Date.now() },
        expired: { type: Boolean, default: true },
      },
      deleted: { type: Boolean, default: false },
      priority: {
        type: String,
        enum: ['none', 'low', 'medium', 'high'],
        default: 'none',
      },
      label: {
        type: String,
        enum: ['none', 'pending', 'processing', 'reviewing', 'completed'],
        default: 'none',
      },
    },
  },
  { timestamps: true }
);

const Note = model('Note', NoteSchema);
export default Note;
