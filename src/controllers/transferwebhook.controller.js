const TransferWebhookModel = require('../models/transferwebhook.model');
const { handleBalanceUpdate } = require('../utils/handleBalanceUpdate');

const handle = async (payload) => {
  const { trx_ref, meta, status, session_id } = payload;

  if (!trx_ref || !meta?.account_number) {
    throw new Error('Missing reference or account number');
  }

  const virtualAccount = await TransferWebhookModel.findVirtualAccountByNumber(meta.account_number);
  if (!virtualAccount) {
    throw new Error('Virtual account not found');
  }

  const transaction = await TransferWebhookModel.findTransactionByReference(trx_ref);

  const txnData = {
    session_id: session_id,
    status: status
  };

  if (transaction) {
    await TransferWebhookModel.updateTransaction(trx_ref, txnData);
  } 

};

module.exports = { handle };
