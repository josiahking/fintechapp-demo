// src/routes/webhook.js
const express = require('express');
const router = express.Router();
const validateWebhook = require('../middlewares/validateWebhook');
const { handleWebhook } = require('../controllers/webhook.controller');

/**
 * @route   POST /api/webhook
 * @desc    Receive and process incoming webhook events from Raven
 * @access  Public (secured via secret key in payload)
 * 
 * Expected payload for transfer:
 * {
 *   "secret": "RAVEN_WEBHOOK_SECRET",
 *   "type": "transfer",
 *   "merchant_ref": "abc123",
 *   "trx_ref": "trx789",
 *   "meta": {
 *     "account_number": "1234567890"
 *   },
 *   ...
 * }
 * 
 * Expected payload for collection:
 * {
 *   "secret": "RAVEN_WEBHOOK_SECRET",
 *   "type": "collection",
 *   "account_number": "1234567890",
 *   "amount": 5000,
 *   "source": "external bank",
 *   ...
 * }
 * 
 * Middleware:
 * - `validateWebhook` authenticates request using secret and validates required fields based on `type`.
 * - `handleWebhook` processes the event and logs/updates DB accordingly.
 */
router.post('/', validateWebhook, handleWebhook);

module.exports = router;
