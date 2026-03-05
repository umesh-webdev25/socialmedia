import { verifyToken } from '../utils/jwtUtils.js';
import { createError } from '../helpers/errorHandler.js';
import User from '../models/User.js';

/**
 * Protect routes — verifies Bearer JWT, attaches req.user
 */
export const protect = async (req, _res, next) => {
  try {
    // 1. Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(createError('No token provided. Please log in.', 401));
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify token signature and expiry
    const decoded = verifyToken(token);

    // 3. Fetch user from DB to ensure they still exist
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return next(createError('User belonging to this token no longer exists.', 401));
    }

    // 4. Attach user to request
    req.user = user;
    next();
  } catch (err) {
    next(err); // JWT errors are handled by globalErrorHandler
  }
};

/**
 * Restrict access to specific roles (future-proof)
 * Usage: router.delete('/...', protect, restrictTo('admin'))
 * @param {...string} roles
 */
export const restrictTo = (...roles) => {
  return (req, _res, next) => {
    if (!roles.includes(req.user?.role)) {
      return next(createError('You do not have permission to perform this action.', 403));
    }
    next();
  };
};
