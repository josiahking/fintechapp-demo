const RAVEN_WEBHOOK_SECRET =
  process.env.RAVEN_WEBHOOK_SECRET || 'your_webhook_secret_key';

/**
 * Middleware to validate incoming Raven webhooks.
 *
 * Validates:
 * - Webhook `secret` matches configured `RAVEN_WEBHOOK_SECRET`.
 * - Required fields are present based on webhook `type` (transfer or collection).
 *
 * Returns:
 * - 401 if secret is invalid.
 * - 400 if required fields are missing.
 * - Calls `next()` if all checks pass.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const validateWebhook = (req, res, next) => {
  const {
    secret,
    merchant_ref,
    meta,
    trx_ref,
    type,
    source,
    amount,
    account_number
  } = req.body;

  // Verify shared secret
  if (secret !== RAVEN_WEBHOOK_SECRET) {
    console.warn('Invalid secret on webhook');
    return res.status(401).json({ error: 'Invalid webhook secret' });
  }

  // Type-specific validation
  if (type === 'transfer') {
    if (!merchant_ref || !trx_ref || !meta?.account_number) {
      return res.status(400).json({ error: 'Missing required fields for transfer' });
    }
  } else if (type === 'collection') {
    if (!account_number || !amount || !source) {
      return res.status(400).json({ error: 'Missing required fields for collection' });
    }
  } else {
    return res.status(400).json({ error: 'Invalid webhook type' });
  }

  next(); // Proceed to controller
};

module.exports = validateWebhook;
