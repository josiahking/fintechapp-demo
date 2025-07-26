const RAVEN_WEBHOOK_SECRET =
  process.env.RAVEN_WEBHOOK_SECRET || 'your_webhook_secret_key'

const validateWebhook = (req, res, next) => {
  const { secret, merchant_ref, meta, trx_ref, type, source, amount, account_number } = req.body

  if (secret !== RAVEN_WEBHOOK_SECRET) {
    console.warn('Invalid secret on webhook')
    return res.status(401).json({ error: 'Invalid webhook secret' })
  }

  // Validate Required Fields
  if (type == 'transfer' && (!merchant_ref || !trx_ref || !meta?.account_number)) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  if (type == 'collection' && (!account_number || !amount || !source)) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  next()
}

module.exports = validateWebhook
