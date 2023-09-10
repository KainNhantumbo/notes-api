import Settings from '../models/Settings';
import { Request as IReq, Response as IRes } from 'express';

export default class SettingsController {
  async getSettings(req: IReq, res: IRes) {
    const { user } = req.body;
    const foundDoc = await Settings.findOne({ created_by: user.id }).lean();
    res.status(200).json({ ...foundDoc });
  }

  async updateSettings(req: IReq, res: IRes) {
    const { user, ...data } = req.body;
    await Settings.findOneAndUpdate(
      { _id: user.id },
      { ...data },
      { runValidators: true, new: true, lean: true }
    );
    res.sendStatus(200);
  }
}
