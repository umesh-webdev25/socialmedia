import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import validate from '../middleware/validateMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';
import { registerSchema, loginSchema } from '../validations/authValidation.js';

const router = Router();

/**
 * @route  POST /api/auth/register
 * @desc   Register a new user
 * @access Public
 */
router.post('/register', validate(registerSchema), authController.register);

/**
 * @route  POST /api/auth/login
 * @desc   Login and receive JWT token
 * @access Public
 */
router.post('/login', validate(loginSchema), authController.login);

/**
 * @route  GET /api/auth/me
 * @desc   Get currently authenticated user
 * @access Private
 */
router.get('/me', protect, authController.getMe);

export default router;
