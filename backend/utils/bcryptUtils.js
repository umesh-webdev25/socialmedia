import bcrypt from 'bcryptjs';

const DEFAULT_SALT_ROUNDS = 12;

/**
 * Hash a plain-text password
 * @param {string} password
 * @returns {Promise<string>} hashed password
 */
export const hashPassword = async (password) => {
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || DEFAULT_SALT_ROUNDS;
  return bcrypt.hash(password, saltRounds);
};

/**
 * Compare a plain-text password against a hash
 * @param {string} password - plain text
 * @param {string} hash     - stored bcrypt hash
 * @returns {Promise<boolean>}
 */
export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};
