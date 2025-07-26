const CollectionWebhookModel = require('../models/collectionwebhook.model')
const {
  handleBalanceUpdate,
  toDecimal
} = require('../utils/handleBalanceUpdate')

const handle = async payload => {
  const { session_id, amount, account_number, source } = payload

  if (!session_id || !account_number) {
    throw new Error('Missing reference or account number')
  }

  const virtualAccount =
  await CollectionWebhookModel.findVirtualAccountByNumber(account_number)
  if (!virtualAccount) {
    throw new Error('Virtual account not found')
  }

  const transaction = await CollectionWebhookModel.findTransactionByReference(
    session_id
  )
  const transactionType = 'credit'
  const status = 'successful'
  const category = 'collection'
  const cleanAmount = toDecimal(amount)

  const txnData = {
    user_id: virtualAccount.user_id,
    type: transactionType,
    reference: session_id,
    session_id: session_id,
    amount: cleanAmount,
    description: source.narration,
    status: status,
    category: category
  }

  if (!transaction) {
    const trnId = await CollectionWebhookModel.createTransaction(txnData);
    if (!trnId) throw new Error('Transaction creation failed');
    await CollectionWebhookModel.createCollectionSource(
      trnId,
      virtualAccount.id,
      virtualAccount.user_id,
      cleanAmount,
      source
    );

    handleBalanceUpdate(virtualAccount, amount, transactionType)
  }
}

module.exports = { handle }
