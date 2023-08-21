import { FilterQuery } from 'mongoose';
import Note from '../models/Note';
import { Request as IReq, Response as IRes } from 'express';
import { INote } from '../@types/models';
import AppError from '../lib/app-error';

export default class NoteController {
  async getNote(req: IReq, res: IRes): Promise<void> {
    const { user } = req.body;
    const { id: noteId } = req.params;

    const foundDoc = await Note.findOne({
      _id: noteId,
      created_by: user.id,
    }).lean();

    if (!foundDoc) throw new AppError('Note not found', 404);
    res.status(200).json(foundDoc);
  }

  async getAllNotes(req: IReq, res: IRes): Promise<void> {
    const { user } = req.body;
    const { search, sort, offset, limit, favorite } = req.query;
    const query: FilterQuery<INote> = { created_by: user.id };

    if (search) {
      query['or'] = [
        { name: { $regex: String(search), $options: 'i' } },
        { description: { $regex: String(search), $options: 'i' } },
        { metadata: { tags: { $in: String(search) } } },
      ];
    }

    if (favorite) {
      query.metadata = { favorite: Boolean(Number(favorite)) };
    }

    let queryResult = Note.find({ ...query });

    if (sort) {
      queryResult = queryResult.sort(String(sort));
    } else {
      queryResult = queryResult.sort({ name: 'asc' });
    }

    if (offset && limit) {
      queryResult.skip(Number(offset)).limit(Number(limit));
    }

    const foundDocs = await queryResult.lean();
    res.status(200).json([...foundDocs]);
  }

  async createNote(req: IReq, res: IRes): Promise<void> {
    const { user, ...data } = req.body;
    await Note.create({ ...data, created_by: user.id });
    res.sendStatus(201);
  }

  async updateNote(req: IReq, res: IRes): Promise<void> {
    const { user, ...data } = req.body;
    const { id: noteId } = req.params;

    const updatedDoc = await Note.findOneAndUpdate(
      { _id: noteId, created_by: user.id },
      { ...data },
      { lean: true, runValidators: true, new: true }
    );

    if (!updatedDoc) throw new AppError('Failed to update note data.', 500);
    res.sendStatus(200);
  }

  async deleteNote(req: IReq, res: IRes): Promise<void> {
    const { user } = req.body;
    const { id: noteId } = req.params;

    const deletedDoc = await Note.findOneAndDelete({
      _id: noteId,
      created_by: user.id,
    }).lean();

    if (!deletedDoc) throw new AppError('Failed to delete note data.', 500);
    res.sendStatus(204);
  }
}
