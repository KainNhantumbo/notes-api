import { Router } from 'express';
import asyncWrapper from '../lib/async-wrapper';
import authenticate from '../middlewares/auth';
import UserController from '../controllers/users.controller';

const router = Router();
const controller = new UserController();

/**
 * @swagger
 * "/api/v1/users":
 * get:
 *  tags:
 *    user
 *  summary: Get a requested user object data
 *  responses:
 *    200:
 *      description: user data
 *    404: 
 *      description: user not found
 */
router.get('/', authenticate, asyncWrapper(controller.getUser));


/**
 * @swagger
 * "/api/v1/users":
 * post:
 *  tags:
 *    user
 *  summary: Creates a new user
 *  responses: 
 *    200:
 *      User created successfully
 *    400:
 *      Bad or unrecognized data schema format error
 *    409:
 *      Data conflict error
 *  requestBody:
 *    required: true
 *    contents:
 *      application/json
 *      
 *          
 */
router.post('/', asyncWrapper(controller.createUser));
router.patch('/', authenticate, asyncWrapper(controller.updateUser));
router.delete('/', authenticate, asyncWrapper(controller.deleteUser));

export { router as userRoutes };
