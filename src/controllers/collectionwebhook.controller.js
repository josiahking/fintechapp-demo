const CollectionWebhookModel = require('../models/collectionwebhook.model');
const {
  handleBalanceUpdate,
  toDecimal
} = require('../utils/handleBalanceUpdate');

/**
 * Handles webhook payload from collection (payment) events.
 *
 * Steps:
 * 1. Validate required fields (`session_id`, `account_number`).
 * 2. Find virtual account using `account_number`.
 * 3. Prevent duplicate transactions using `session_id` reference.
 * 4. Construct transaction data and save:
 *    - Save transaction if new.
 *    - Save collection metadata.
 *    - Update user balance.
 *
 * @param {Object} payload - Incoming webhook payload
 * @throws Will throw error if required data is missing or DB operations fail
 */
const handle = async (payload) => {
  const { session_id, amount, account_number, source } = payload;

  // Ensure mandatory fields are present
  if (!session_id || !account_number) {
    throw new Error('Missing reference or account number');
  }

  // Get virtual account details linked to account number
  const virtualAccount = await CollectionWebhookModel.findVirtualAccountByNumber(account_number);
  if (!virtualAccount) {
    throw new Error('Virtual account not found');
  }

  // Check for duplicate transaction
  const transaction = await CollectionWebhookModel.findTransactionByReference(session_id);

  const transactionType = 'credit';
  const status = 'successful';
  const category = 'collection';

  // Convert raw amount to decimal (if needed)
  const cleanAmount = toDecimal(amount);

  // Prepare transaction record
  const txnData = {
    user_id: virtualAccount.user_id,
    type: transactionType,
    reference: session_id,
    session_id: session_id,
    amount: cleanAmount,
    description: source.narration,
    status: status,
    category: category
  };

  // Only create transaction if it doesn't already exist
  if (!transaction) {
    const trnId = await CollectionWebhookModel.createTransaction(txnData);
    if (!trnId) throw new Error('Transaction creation failed');

    // Save metadata/source information for auditing or tracing
    await CollectionWebhookModel.createCollectionSource(
      trnId,
      virtualAccount.id,
      virtualAccount.user_id,
      cleanAmount,
      source
    );

    // Update user balance
    handleBalanceUpdate(virtualAccount, amount, transactionType);
  }
};

module.exports = { handle };
