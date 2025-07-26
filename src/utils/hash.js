const bcrypt = require('bcryptjs');

/**
 * Hashes a plain text password using bcrypt.
 *
 * @param {string} password - The plain text password.
 * @returns {Promise<string>} - The hashed password.
 * @throws {Error} - If input is not a string or hashing fails.
 */
exports.hashPassword = async (password) => {
  if (typeof password !== 'string') {
    throw new Error('Password must be a string');
  }
  return await bcrypt.hash(password, 10);
};

/**
 * Compares a plain text password with a hashed password.
 *
 * @param {string} password - The plain text password.
 * @param {string} hash - The bcrypt hashed password.
 * @returns {Promise<boolean>} - True if passwords match, false otherwise.
 * @throws {Error} - If comparison fails.
 */
exports.comparePassword = async (password, hash) => {
  if (typeof password !== 'string' || typeof hash !== 'string') {
    throw new Error('Invalid input types for password comparison');
  }
  return await bcrypt.compare(password, hash);
};
