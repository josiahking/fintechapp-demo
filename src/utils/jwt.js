const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;
if (!SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

/**
 * Generate a JWT token with the given payload.
 *
 * @param {Object} payload - The data to embed in the token (e.g., user ID).
 * @returns {string} - The signed JWT token.
 */
exports.generateToken = (payload) => {
  if (typeof payload !== 'object' || payload === null) {
    throw new Error('Payload must be a non-null object');
  }

  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
};

/**
 * Verify and decode a JWT token.
 *
 * @param {string} token - The JWT token to verify.
 * @returns {Object} - The decoded payload if valid.
 * @throws {Error} - If token is invalid or expired.
 */
exports.verifyToken = (token) => {
  if (!token || typeof token !== 'string') {
    throw new Error('Token must be a non-empty string');
  }

  return jwt.verify(token, SECRET);
};
