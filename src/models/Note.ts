import { Schema, model } from 'mongoose';
import { Note } from '../types/models';
import AppError from '../lib/app-error';

const NoteSchema = new Schema<Note>(
  {
    title: {
      type: String,
      maxlength: [128, 'Title field is too long'],
      default: 'Untitled'
    },
    created_by: { type: Schema.Types.ObjectId, ref: 'User' },
    folder_id: { type: Schema.Types.ObjectId, ref: 'Folder' },
    content: { type: Object },
    pinned: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    tags: [
      {
        id: { type: String, required: [true, 'Please provide tag ID'] },
        color: { type: String, required: [true, 'Please provide tag color'] },
        value: { type: String, required: [true, 'Please provide tag value'] }
      }
    ],
    priority: {
      type: String,
      enum: ['none', 'low', 'medium', 'high'],
      default: 'none'
    },
    status: {
      type: String,
      enum: ['none', 'active', 'pending', 'reviewing', 'completed'],
      default: 'none'
    }
  },
  { timestamps: true }
);

const Note = model('Note', NoteSchema);
export default Note;
