const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 *
 * Expected body:
 * {
 *   "first_name": "John",
 *   "last_name": "Doe",
 *   "email": "john@example.com",
 *   "phone": "08012345678",
 *   "password": "securePassword"
 * }
 */
router.post('/signup', authController.signup);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return a JWT token
 * @access  Public
 *
 * Expected body:
 * {
 *   "email": "john@example.com",
 *   "password": "securePassword"
 * }
 */
router.post('/login', authController.login);

module.exports = router;
