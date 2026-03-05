import mongoose from 'mongoose';

/**
 * Validate that a string is a valid MongoDB ObjectId
 * @param {string} id
 * @returns {boolean}
 */
export const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * Strip sensitive fields from a user object before sending to client
 * @param {object} user - Mongoose document or plain object
 * @returns {object}
 */
export const sanitizeUser = (user) => {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  delete obj.__v;
  return obj;
};

/**
 * Async wrapper — eliminates repetitive try/catch in controllers
 * @param {Function} fn - async route handler
 * @returns {Function} Express middleware
 */
export const asyncWrapper = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
