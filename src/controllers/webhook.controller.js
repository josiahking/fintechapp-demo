const Webhook = require('../models/webhook.model');
const TransferWebhookController = require('./transferwebhook.controller');
const CollectionWebhookController = require('./collectionwebhook.controller');

/**
 * Handles incoming webhook requests from the payment gateway.
 *
 * Steps:
 * 1. Accept raw payload from the request body.
 * 2. Store the raw webhook payload for audit/logging.
 * 3. Dispatch the webhook based on its `type`:
 *    - `transfer`  → handled by TransferWebhookController
 *    - `collection` → handled by CollectionWebhookController
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
const handleWebhook = async (req, res) => {
  const payload = req.body;

  // Destructure webhook type (e.g., 'transfer' or 'collection')
  const { type } = payload;

  try {
    // 1. Save the raw webhook payload for debugging and auditing
    await Webhook.log(payload);

    // 2. Route to appropriate handler based on type
    if (type === 'transfer') {
      await TransferWebhookController.handle(payload);
    } else if (type === 'collection') {
      await CollectionWebhookController.handle(payload);
    }

    // 3. Acknowledge successful receipt of the webhook
    return res.status(200).json({ received: true });
  } catch (error) {
    // Handle and log any processing error
    console.error('Webhook Controller Error:', error.message);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
};

module.exports = { handleWebhook };
