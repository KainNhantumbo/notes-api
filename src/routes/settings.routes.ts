import { Router } from 'express';
import asyncWrapper from '../lib/async-wrapper';
import authenticate from '../middlewares/auth';
import SettingsController from '../controllers/settings.controller';

const router = Router();
const controller = new SettingsController();

router
  .route('/')
  .get(authenticate, asyncWrapper(controller.getSettings))
  .patch(authenticate, asyncWrapper(controller.updateSettings))

export { router as settingsRoutes };
