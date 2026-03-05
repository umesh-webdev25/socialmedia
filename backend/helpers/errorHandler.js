import { ValidationError } from 'yup';

/**
 * 404 Not Found handler – must be placed after all routes
 */
export const notFoundHandler = (req, res, _next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

/**
 * Global error handler – must be placed last in the middleware stack
 * Handles Mongoose, JWT, Yup, and generic errors consistently
 */
// eslint-disable-next-line no-unused-vars
export const globalErrorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = null;

  // ── Yup Validation Error ─────────────────────────────────────────────────
  if (err instanceof ValidationError) {
    statusCode = 422;
    message = 'Validation failed';
    errors = err.inner.length
      ? err.inner.map((e) => ({ field: e.path, message: e.message }))
      : [{ field: err.path, message: err.message }];
  }

  // ── Mongoose Validation Error ────────────────────────────────────────────
  else if (err.name === 'ValidationError' && err.errors) {
    statusCode = 422;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
  }

  // ── Mongoose Duplicate Key (unique constraint) ───────────────────────────
  else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  // ── Mongoose CastError (invalid ObjectId) ───────────────────────────────
  else if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // ── JWT Errors ───────────────────────────────────────────────────────────
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired. Please log in again.';
  }

  // Log unexpected server errors
  if (statusCode >= 500) {
    console.error('SERVER ERROR:', err);
  }

  const payload = { success: false, message };
  if (errors) payload.errors = errors;

  res.status(statusCode).json(payload);
};

/**
 * Create a custom application error with an HTTP status code
 * @param {string} message
 * @param {number} statusCode
 * @returns {Error}
 */
export const createError = (message, statusCode = 500) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};
