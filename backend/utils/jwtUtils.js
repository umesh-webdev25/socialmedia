import jwt from 'jsonwebtoken';

const JWT_SECRET = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return process.env.JWT_SECRET;
};

const JWT_EXPIRES_IN = () => process.env.JWT_EXPIRES_IN || '7d';

/**
 * Generate a signed JWT for a given user ID
 * @param {string} userId - Mongoose ObjectId as string
 * @returns {string} signed JWT token
 */
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET(), { expiresIn: JWT_EXPIRES_IN() });
};

/**
 * Verify and decode a JWT token
 * @param {string} token
 * @returns {{ id: string, iat: number, exp: number }}
 */
export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET());
};

/**
 * Decode a JWT WITHOUT verifying the signature (for inspection only)
 * @param {string} token
 * @returns {object|null}
 */
export const decodeToken = (token) => {
  return jwt.decode(token);
};
