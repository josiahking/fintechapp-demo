const express = require('express');
const { createAccount } = require('../controllers/accountController');
const authenticate = require('../middlewares/authMiddleware');
const validateAccountInput = require('../middlewares/validateAccountInput');

const router = express.Router();

// @route   POST /api/accounts/create
// @desc    Create a virtual account for user
// @access  Private
router.post('/create', authenticate, validateAccountInput, createAccount);

module.exports = router;
