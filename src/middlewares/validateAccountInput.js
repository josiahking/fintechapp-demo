const Joi = require('joi');

/**
 * Joi schema for validating account creation input
 *
 * Fields:
 * - first_name: required string (trimmed)
 * - last_name: optional string (trimmed)
 * - email: required, must be a valid email
 * - phone: required string (trimmed)
 * - amount: required, must be a positive number
 */
const accountSchema = Joi.object({
  first_name: Joi.string().trim().required(),
  last_name: Joi.string().trim().optional(),
  email: Joi.string().email().required(),
  phone: Joi.string().trim().required(),
  amount: Joi.number().positive().required()
});

/**
 * Express middleware to validate account input using Joi schema
 *
 * If valid:
 * - Calls `next()` to proceed
 *
 * If invalid:
 * - Responds with HTTP 400 and the first validation error message
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {Function} next - Express next middleware function
 */
function validateAccountInput(req, res, next) {
  const { error } = accountSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
}

module.exports = validateAccountInput;
