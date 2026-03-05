/**
 * Send a standardised success response
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {*} data
 */
export const successResponse = (res, statusCode = 200, message = 'Success', data = null) => {
  const payload = { success: true, message };
  if (data !== null) payload.data = data;
  return res.status(statusCode).json(payload);
};

/**
 * Send a standardised error response
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {*} errors - optional detailed errors (e.g. validation errors)
 */
export const errorResponse = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
  const payload = { success: false, message };
  if (errors !== null) payload.errors = errors;
  return res.status(statusCode).json(payload);
};

/**
 * Send a paginated success response
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {Array} data
 * @param {{ total: number, page: number, limit: number, pages: number }} pagination
 */
export const paginatedResponse = (res, statusCode = 200, message = 'Success', data = [], pagination = {}) => {
  return res.status(statusCode).json({ success: true, message, pagination, data });
};
