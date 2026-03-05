import * as userService from '../services/userService.js';
import { successResponse } from '../utils/responseUtils.js';
import { asyncWrapper } from '../utils/helpers.js';

/**
 * GET /api/users/profile  (protected)
 * Returns the authenticated user's profile
 */
export const getProfile = asyncWrapper(async (req, res) => {
  const user = await userService.getProfile(req.user._id);
  successResponse(res, 200, 'Profile retrieved successfully', { user });
});

/**
 * PATCH /api/users/profile  (protected)
 * Body: { name?, bio?, profilePicture? }
 * Email is READ-ONLY and cannot be changed
 */
export const updateProfile = asyncWrapper(async (req, res) => {
  const user = await userService.updateProfile(req.user._id, req.body);
  successResponse(res, 200, 'Profile updated successfully', { user });
});
