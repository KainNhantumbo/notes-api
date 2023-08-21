import { Router } from 'express';
import asyncWrapper from '../lib/async-wrapper';
import authenticate from '../middlewares/auth';
import FolderController from '../controllers/folders.controller';

const router = Router();
const controller = new FolderController();

router
  .route('/')
  .get(authenticate, asyncWrapper(controller.getFolders))
  .post(authenticate, asyncWrapper(controller.createFolder));

router
  .route('/:id')
  .patch(authenticate, asyncWrapper(controller.updateFolder))
  .delete(authenticate, asyncWrapper(controller.deleteFolder));

export { router as folderRoutes };
