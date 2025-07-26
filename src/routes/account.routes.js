const express = require('express');
const { createAccount } = require('../controllers/accountController');
const authenticate = require('../middlewares/authMiddleware');
const validateAccountInput = require('../middlewares/validateAccountInput');

const router = express.Router();

/**
 * @route   POST /api/accounts/create
 * @desc    Creates a virtual account for the authenticated user
 * @access  Private (requires JWT token)
 * 
 * Middleware chain:
 *   1. authenticate — verifies JWT and adds user info to request
 *   2. validateAccountInput — validates request body using Joi
 *   3. createAccount — handles creation of the virtual account in DB
 */
router.post('/create', authenticate, validateAccountInput, createAccount);

module.exports = router;
