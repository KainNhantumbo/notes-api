import { Schema, model } from 'mongoose';
import { IFolder } from '../@types/models';

const FolderSchema = new Schema<IFolder>(
  {
    name: {
      type: String,
      required: [true, 'Plese give a for your folder before saving'],
      minlength: [3, 'Folder name is too short'],
      maxlength: [16, 'Folder name is too long'],
    },
    metadata: {
      color: { type: String, default: '#fff' },
      favorite: { type: Boolean, default: false },
      tags: [{ type: String }],
    },
  },
  { timestamps: true }
);

const Folder = model('Folder', FolderSchema);
export default Folder;
