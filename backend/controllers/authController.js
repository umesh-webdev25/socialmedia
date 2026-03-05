import * as authService from '../services/authService.js';
import { successResponse } from '../utils/responseUtils.js';
import { asyncWrapper } from '../utils/helpers.js';

/**
 * POST /api/auth/register
 * Body: { name, email, password }
 */
export const register = asyncWrapper(async (req, res) => {
  const { name, email, password } = req.body;
  const { user, token } = await authService.registerUser({ name, email, password });

  successResponse(res, 201, 'Account created successfully', { user, token });
});

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
export const login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.loginUser({ email, password });

  successResponse(res, 200, 'Logged in successfully', { user, token });
});

/**
 * GET /api/auth/me  (protected)
 * Returns the currently authenticated user (lightweight check endpoint)
 */
export const getMe = asyncWrapper(async (req, res) => {
  successResponse(res, 200, 'Authenticated user retrieved', { user: req.user });
});
