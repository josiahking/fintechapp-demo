// test/collectionWebhook.test.js
const { handle } = require('../src/controllers/collectionwebhook.controller');
const CollectionWebhookModel = require('../src/models/collectionwebhook.model');
const handleBalanceUtils = require('../src/utils/handleBalanceUpdate');

// Mock dependencies
jest.mock('../src/models/collectionwebhook.model');
jest.mock('../src/utils/handleBalanceUpdate');

describe('Collection Webhook Handler', () => {
  const payload = {
    session_id: 'TXN12345',
    amount: 500,
    account_number: '1234567890',
    source: {
      narration: 'Payment for goods',
      account_number: '0987654321',
      first_name: 'Jane',
      last_name: 'Doe',
      bank: 'Zenith Bank',
      bank_code: '057'
    }
  };

  const virtualAccount = {
    id: 'virtual-id-001',
    user_id: 'user-id-123',
    account_number: '1234567890'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should throw error if session_id or account_number is missing', async () => {
    const badPayload = { ...payload, session_id: undefined };

    await expect(handle(badPayload)).rejects.toThrow('Missing reference or account number');
  });

  test('should throw error if virtual account not found', async () => {
    CollectionWebhookModel.findVirtualAccountByNumber.mockResolvedValue(null);

    await expect(handle(payload)).rejects.toThrow('Virtual account not found');
  });

  test('should skip if transaction already exists', async () => {
    CollectionWebhookModel.findVirtualAccountByNumber.mockResolvedValue(virtualAccount);
    CollectionWebhookModel.findTransactionByReference.mockResolvedValue({ id: 'txn-id-999' });

    await handle(payload);

    expect(CollectionWebhookModel.createTransaction).not.toHaveBeenCalled();
    expect(handleBalanceUtils.handleBalanceUpdate).not.toHaveBeenCalled();
  });

  test('should create transaction, collection source and update balance if new', async () => {
    CollectionWebhookModel.findVirtualAccountByNumber.mockResolvedValue(virtualAccount);
    CollectionWebhookModel.findTransactionByReference.mockResolvedValue(null);
    CollectionWebhookModel.createTransaction.mockResolvedValue('new-txn-id');
    CollectionWebhookModel.createCollectionSource.mockResolvedValue(true);
    handleBalanceUtils.toDecimal.mockReturnValue(500);
    handleBalanceUtils.handleBalanceUpdate.mockResolvedValue(true);

    await handle(payload);

    expect(CollectionWebhookModel.createTransaction).toHaveBeenCalledWith(expect.objectContaining({
      user_id: virtualAccount.user_id,
      reference: payload.session_id,
      type: 'credit',
      category: 'collection',
      amount: 500,
      description: payload.source.narration,
      status: 'successful',
    }));

    expect(CollectionWebhookModel.createCollectionSource).toHaveBeenCalledWith(
      'new-txn-id',
      virtualAccount.id,
      virtualAccount.user_id,
      500,
      payload.source
    );

    expect(handleBalanceUtils.handleBalanceUpdate).toHaveBeenCalledWith(
      virtualAccount,
      payload.amount,
      'credit'
    );
  });

  test('should throw if transaction creation fails', async () => {
    CollectionWebhookModel.findVirtualAccountByNumber.mockResolvedValue(virtualAccount);
    CollectionWebhookModel.findTransactionByReference.mockResolvedValue(null);
    CollectionWebhookModel.createTransaction.mockResolvedValue(null); // simulate failure
    handleBalanceUtils.toDecimal.mockReturnValue(500);

    await expect(handle(payload)).rejects.toThrow('Transaction creation failed');
  });
});
