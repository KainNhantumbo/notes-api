import { Router } from 'express';
import asyncWrapper from '../lib/async-wrapper';
import authenticate from '../middlewares/auth';
import NotesController from '../controllers/notes.controller';

const router = Router();
const controller = new NotesController();

router
  .route('/')
  .get(authenticate, asyncWrapper(controller.getAllNotes))
  .post(authenticate, asyncWrapper(controller.createNote))
  .delete(authenticate, asyncWrapper(controller.deleteTrashNotes));

router
  .route('/:id')
  .get(authenticate, asyncWrapper(controller.getNote))
  .patch(authenticate, asyncWrapper(controller.updateNote))
  .delete(authenticate, asyncWrapper(controller.deleteNote));

export { router as notesRoutes };
