import { Schema, model } from 'mongoose';
import { INote } from '../types/models';

const NoteSchema = new Schema<INote>(
  {
    title: {
      type: String,
      maxlength: [128, 'Title field is too long'],
      default: 'Untitled',
    },
    created_by: { type: Schema.Types.ObjectId, ref: 'User' },
    content: { type: String },
    metadata: {
      folder_id: { type: String },
      color: { type: String, default: '' },
      bookmarked: { type: Boolean, default: false },
      tags: [
        {
          id: { type: String, required: [true, 'Please provide tag ID'] },
          color: { type: String, required: [true, 'Please provide tag color'] },
          value: { type: String, required: [true, 'Please provide tag value'] },
        },
      ],
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
      status: {
        type: String,
        enum: [
          'none',
          'pending',
          'active',
          'reviewing',
          'completed',
          'cancelled',
        ],
        default: 'none',
      },
    },
  },
  { timestamps: true }
);

const Note = model('Note', NoteSchema);
export default Note;
