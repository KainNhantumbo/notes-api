import { Router } from 'express';
import asyncWrapper from '../utils/async-wrapper';
import authenticate from '../middlewares/auth';
import UserController from '../controllers/users.controller';

const router = Router();
const controller = new UserController();

router
  .route('/')
  .get(authenticate, asyncWrapper(controller.getUser))
  .post(asyncWrapper(controller.createUser))
  .patch(authenticate, asyncWrapper(controller.updateUser))
  .delete(authenticate, asyncWrapper(controller.deleteUser));

export { router as userRoutes };
