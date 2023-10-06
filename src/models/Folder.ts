import { Schema, model } from 'mongoose';
import { Folder } from '../types/models';

const FolderSchema = new Schema<Folder>(
  {
    name: {
      type: String,
      required: [true, 'Plese give a for your folder before saving'],
      minlength: [3, 'Folder name is too short'],
      maxlength: [16, 'Folder name is too long']
    },
    created_by: { type: Schema.Types.ObjectId, ref: 'User' },
    metadata: {
      color: { type: String, default: '#fff' },
      favorite: { type: Boolean, default: false },
      tags: [{ type: String }],
      deleted: { type: Boolean, default: false }
    }
  },
  { timestamps: true }
);

const Folder = model('Folder', FolderSchema);
export default Folder;
