import { Router } from 'express';
import asyncWrapper from '../utils/async-wrapper';
import AuthController from '../controllers/auth.controller';

const router = Router();
const controller = new AuthController();

router.get('/default/refresh', asyncWrapper(controller.refresh));
router.post('/default/login', asyncWrapper(controller.defaultLogin));
router.post('/default/logout', asyncWrapper(controller.logout));

export { router as authRoutes };
