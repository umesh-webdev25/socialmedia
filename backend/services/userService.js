import User from '../models/User.js';
import { createError } from '../helpers/errorHandler.js';
import { sanitizeUser } from '../utils/helpers.js';

/**
 * Get the profile of the currently authenticated user
 * @param {string} userId
 * @returns {object} safe user object
 */
export const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw createError('User not found', 404);
  }
  return sanitizeUser(user);
};

/**
 * Update mutable profile fields (name, bio, profilePicture).
 * Email is intentionally excluded and can never be updated.
 *
 * @param {string} userId
 * @param {{ name?: string, bio?: string, profilePicture?: string }} updates
 * @returns {object} updated safe user object
 */
export const updateProfile = async (userId, updates) => {
  // Explicitly whitelist updatable fields — email cannot be changed
  const allowedUpdates = {};
  if (updates.name !== undefined)           allowedUpdates.name = updates.name;
  if (updates.bio !== undefined)            allowedUpdates.bio = updates.bio;
  if (updates.profilePicture !== undefined) allowedUpdates.profilePicture = updates.profilePicture;

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: allowedUpdates },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw createError('User not found', 404);
  }

  return sanitizeUser(user);
};
