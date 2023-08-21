import { FilterQuery } from 'mongoose';
import Folder from '../models/Folder';
import { Request as IReq, Response as IRes } from 'express';
import { IFolder } from '../@types/models';
import AppError from '../lib/app-error';

export default class FolderController {
  async getFolders(req: IReq, res: IRes): Promise<void> {
    const { user } = req.body;
    const { search, sort, offset, limit } = req.query;
    const query: FilterQuery<IFolder> = { search: '', created_by: user.id };

    if (search) query.search = String(search);

    let queryResult = Folder.find({ ...query });

    if (sort) {
      queryResult = queryResult.sort(String(sort));
    } else {
      queryResult = queryResult.sort('-name');
    }

    if (offset && limit) {
      queryResult.skip(Number(offset)).limit(Number(limit));
    }

    const foundDocs = await queryResult.lean();
    res.status(200).json([...foundDocs]);
  }

  async createFolder(req: IReq, res: IRes): Promise<void> {
    const { user, ...data } = req.body;
    await Folder.create({ ...data, created_by: user.id });
    res.sendStatus(201);
  }

  async updateFolder(req: IReq<{ id: string }>, res: IRes): Promise<void> {
    const { user, ...data } = req.body;
    const { id: folderId } = req.params;

    const updatedDoc = await Folder.findOneAndUpdate(
      { _id: folderId, created_by: user.id },
      { ...data },
      { lean: true, runValidators: true, new: true }
    );

    if (!updatedDoc) throw new AppError('Failed to update folder data.', 500);
    res.sendStatus(200);
  }

  async deleteFolder(req: IReq<{ id: string }>, res: IRes): Promise<void> {
    const { user } = req.body;
    const { id: folderId } = req.params;
    const deletedDoc = await Folder.findOneAndDelete({
      _id: folderId,
      created_by: user.id,
    }).lean();
    if (!deletedDoc) throw new AppError('Failed to delete folder data.', 500);
    res.sendStatus(204);
  }
}
