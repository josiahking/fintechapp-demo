const TransferWebhookModel = require('../models/transferwebhook.model');
const { handleBalanceUpdate } = require('../utils/handleBalanceUpdate');

/**
 * Handles webhook payload from transfer (outbound) events.
 *
 * Steps:
 * 1. Validate presence of `trx_ref` and `account_number`.
 * 2. Find the target virtual account using account number.
 * 3. Check for existing transaction using `trx_ref`.
 * 4. If found, update the transaction status and session ID.
 *
 * @param {Object} payload - Incoming webhook payload from the payment gateway
 * @throws Will throw an error if required fields or account are missing
 */
const handle = async (payload) => {
  const { trx_ref, meta, status, session_id } = payload;

  // Basic validation to ensure required values are present
  if (!trx_ref || !meta?.account_number) {
    throw new Error('Missing reference or account number');
  }

  // Fetch virtual account using the account number provided
  const virtualAccount = await TransferWebhookModel.findVirtualAccountByNumber(meta.account_number);
  if (!virtualAccount) {
    throw new Error('Virtual account not found');
  }

  // Attempt to find existing transaction using the transfer reference
  const transaction = await TransferWebhookModel.findTransactionByReference(trx_ref);

  // Prepare update payload with status and session ID
  const txnData = {
    session_id: session_id,
    status: status
  };

  // If the transaction exists, update it with new status/session
  if (transaction) {
    await TransferWebhookModel.updateTransaction(trx_ref, txnData);
  }
};

module.exports = { handle };
