const Webhook = require('../models/webhook.model');
const TransferWebhookController = require('./transferwebhook.controller');
const CollectionWebhookController = require('./collectionwebhook.controller');

const handleWebhook = async (req, res) => {
  const payload = req.body;

  const {
    type
  } = payload;

  try {
    // Store raw webhook
    await Webhook.log(payload);

    if (type === 'transfer') {
      await TransferWebhookController.handle(payload);
    } else if (type === 'collection') {
      await CollectionWebhookController.handle(payload);
    }
    

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook Controller Error:', error.message);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
};

module.exports = { handleWebhook };
