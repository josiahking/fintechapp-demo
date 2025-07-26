const jwt = require('jsonwebtoken');

/**
 * JWT Authentication Middleware
 *
 * Purpose:
 * Protects private routes by validating the presence and integrity of a JWT token
 * sent in the `Authorization` header using the format: Bearer <token>.
 *
 * If valid:
 * - Attaches the decoded user data (e.g. `{ id }`) to `req.user`
 * - Calls `next()` to proceed
 *
 * If invalid:
 * - Responds with HTTP 401 Unauthorized
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check for missing or malformed Authorization header
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  // Extract token from header
  const token = authHeader.split(' ')[1];

  try {
    // Verify and decode token using the JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request object for use in next middleware/routes
    req.user = decoded; // Typically { id, email } or just { id }

    next(); // Proceed to the next handler
  } catch (err) {
    // Token is invalid or expired
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

module.exports = authenticate;
