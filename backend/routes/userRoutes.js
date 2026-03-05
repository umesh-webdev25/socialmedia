import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import validate from '../middleware/validateMiddleware.js';
import { updateProfileSchema } from '../validations/userValidation.js';

const router = Router();

// All user profile routes require authentication
router.use(protect);

/**
 * @route  GET /api/users/profile
 * @desc   Get the authenticated user's profile
 * @access Private
 */
router.get('/profile', userController.getProfile);

/**
 * @route  PATCH /api/users/profile
 * @desc   Update profile (name, bio, profilePicture) — email is read-only
 * @access Private
 */
router.patch('/profile', validate(updateProfileSchema), userController.updateProfile);

export default router;
