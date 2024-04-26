import Note from '../models/Note';
import AppError from '../utils/app-error';
import { sanitizer } from '../utils/content-sanitizer';
import type { Note as NoteType } from '../types/models';
import { FilterQuery, isValidObjectId } from 'mongoose';
import { Request as IReq, Response as IRes } from 'express';

export default class NoteController {
  async getNote(req: IReq, res: IRes) {
    const { user } = req.body;
    const { id: noteId } = req.params;

    const foundDoc = await Note.findOne({
      _id: noteId,
      created_by: user.id
    })
      .populate({ path: 'folder_id' })
      .select('-__v')
      .lean();

    if (!foundDoc) throw new AppError('Requested note was not found.', 404);
    res.status(200).json(foundDoc);
  }

  async getAllNotes(req: IReq, res: IRes) {
    const { user } = req.body;
    const { search, sort, offset, limit, status, priority } = req.query;
    const query: FilterQuery<NoteType> = { created_by: user.id };

    if (search) {
      query['$or'] = [
        { title: { $regex: String(search), $options: 'i' } },
        { content: { $regex: String(search), $options: 'i' } },
        {
          tags: {
            $elemMatch: { value: { $regex: String(search), $options: 'i' } }
          }
        }
      ];
    }

    if (status) query.status = String(status);

    if (priority) query.priority = String(priority);

    let queryResult = Note.find({ ...query });

    if (sort) {
      queryResult = queryResult.sort(String(sort));
    } else {
      queryResult = queryResult.sort({ updatedAt: 'desc' });
    }

    if (offset && limit) queryResult.skip(Number(offset)).limit(Number(limit));

    const foundDocs = await queryResult.lean();
    res.status(200).json([...foundDocs]);
  }

  async createNote(req: IReq, res: IRes) {
    const { user, content, ...data } = req.body;
    const cleanContent = await sanitizer(String(content));
    
    const createdDoc = await Note.create({
      ...data,
      content: cleanContent,
      created_by: user.id
    });
    res.status(201).json(createdDoc);
  }

  async updateNote(req: IReq, res: IRes) {
    const { user, content, ...data } = req.body;
    const { id: noteId } = req.params;

    const existingDoc = await Note.findOne({ _id: noteId }).lean();
    if (!existingDoc)
      throw new AppError(
        'Failed to update note because it was not found.',
        404
      );

    if (data?.metadata?.folder_id) {
      if (!isValidObjectId(data?.metadata?.folder_id)) {
        throw new AppError(
          'Invalid note folder ID, please check and try again.',
          400
        );
      }
    }

    const cleanContent = await sanitizer(String(content));

    const updatedDoc = await Note.findOneAndUpdate(
      { _id: noteId, created_by: user.id },
      { ...data, content: cleanContent },
      { lean: true, runValidators: true, new: true }
    );

    if (!updatedDoc) throw new AppError('Failed to update note data.', 500);
    res.status(200).json({ ...updatedDoc });
  }

  async deleteNote(req: IReq, res: IRes) {
    const { user } = req.body;
    const { id: noteId } = req.params;

    const existingDoc = await Note.findOne({ _id: noteId }).lean();
    if (!existingDoc)
      throw new AppError(
        'Failed to delete note because the requested note was not found.',
        404
      );

    const deletedDoc = await Note.findOneAndDelete({
      _id: noteId,
      created_by: user.id
    }).lean();

    if (!deletedDoc) throw new AppError('Failed to delete note data.', 500);
    res.sendStatus(204);
  }

  async deleteTrashNotes(req: IReq, res: IRes) {
    const { user } = req.body;
    await Note.deleteMany(
      { created_by: user.id, deleted: true },
      { lean: true }
    );
    res.sendStatus(204);
  }
}
