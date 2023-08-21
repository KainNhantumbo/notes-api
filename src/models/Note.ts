import { Schema, model } from 'mongoose';
import { INote } from '../@types/models';

const NoteSchema = new Schema<INote>(
  {
    name: {
      type: String,
      required: [true, 'Plese give a title to your note before saving'],
      minlength: [8, 'Title field is too short'],
      maxlength: [128, 'Title field is too long'],
    },
    description: {
      type: String,
      maxlength: [256, 'Description field is too long'],
    },
    content: {
      time: { type: Number },
      version: { type: String },
      blocks: [
        {
          type: Array,
          required: [true, 'Escreva o conteúdo da postagem'],
        },
      ],
    },
    metadata: {
      folder: { type: Schema.Types.ObjectId, ref: 'Folder' },
      color: { type: String, default: '#fff' },
      favorite: { type: Boolean, default: false },
      reminder: {
        time: { type: Date, default: Date.now() },
        expired: { type: Boolean, default: true },
      },
      tags: [{ type: String }],
    },
  },
  { timestamps: true }
);

const Note = model('Note', NoteSchema);
export default Note;
