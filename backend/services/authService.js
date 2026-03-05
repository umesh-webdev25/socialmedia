import User from '../models/User.js';
import { generateToken } from '../utils/jwtUtils.js';
import { createError } from '../helpers/errorHandler.js';
import { sanitizeUser } from '../utils/helpers.js';

/**
 * Register a new user
 * @param {{ name: string, email: string, password: string }} data
 * @returns {{ user: object, token: string }}
 */
export const registerUser = async ({ name, email, password }) => {
  // Check for duplicate email
  const existing = await User.findOne({ email });
  if (existing) {
    throw createError('An account with this email already exists', 409);
  }

  // Password is hashed by the pre-save hook on the User model
  const user = await User.create({ name, email, password });

  const token = generateToken(user._id.toString());

  return { user: sanitizeUser(user), token };
};

/**
 * Authenticate an existing user
 * @param {{ email: string, password: string }} data
 * @returns {{ user: object, token: string }}
 */
export const loginUser = async ({ email, password }) => {
  // Explicitly select password (excluded by default via `select: false`)
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw createError('Invalid email or password', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw createError('Invalid email or password', 401);
  }

  const token = generateToken(user._id.toString());

  return { user: sanitizeUser(user), token };
};
