// src/routes/webhook.js
const express = require('express');
const router = express.Router();
const validateWebhook = require('../middlewares/validateWebhook');
const { handleWebhook } = require('../controllers/webhook.controller')

const RAVEN_WEBHOOK_SECRET = process.env.RAVEN_WEBHOOK_SECRET || 'your_webhook_secret_key';

router.post('/', validateWebhook, handleWebhook);

module.exports = router;
