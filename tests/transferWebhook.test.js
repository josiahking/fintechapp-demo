const knex = require('../knex'); // Adjust based on your project structure
const { handle } = require('../src/controllers/transferwebhook.controller');
const TransferWebhookModel = require('../src/models/transferwebhook.model');

jest.mock('../src/models/transferwebhook.model');

describe('Transfer Webhook Handler', () => {
  const mockPayload = {
    trx_ref: 'test-ref-123',
    session_id: 'session-789',
    status: 'successful',
    meta: {
      account_number: '1234567890'
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update transaction when valid payload is passed', async () => {
    const mockVirtualAccount = { id: 1, user_id: 'user-1' };
    const mockTransaction = { id: 2, reference: 'test-ref-123' };

    TransferWebhookModel.findVirtualAccountByNumber.mockResolvedValue(mockVirtualAccount);
    TransferWebhookModel.findTransactionByReference.mockResolvedValue(mockTransaction);
    TransferWebhookModel.updateTransaction.mockResolvedValue(1);

    await handle(mockPayload);

    expect(TransferWebhookModel.findVirtualAccountByNumber).toHaveBeenCalledWith('1234567890');
    expect(TransferWebhookModel.findTransactionByReference).toHaveBeenCalledWith('test-ref-123');
    expect(TransferWebhookModel.updateTransaction).toHaveBeenCalledWith('test-ref-123', {
      session_id: 'session-789',
      status: 'successful'
    });
  });

  it('should throw error if trx_ref is missing', async () => {
    const payload = { ...mockPayload };
    delete payload.trx_ref;

    await expect(handle(payload)).rejects.toThrow('Missing reference or account number');
  });

  it('should throw error if account_number is missing in meta', async () => {
    const payload = { ...mockPayload, meta: {} };

    await expect(handle(payload)).rejects.toThrow('Missing reference or account number');
  });

  it('should throw error if virtual account is not found', async () => {
    TransferWebhookModel.findVirtualAccountByNumber.mockResolvedValue(null);

    await expect(handle(mockPayload)).rejects.toThrow('Virtual account not found');
  });

  it('should not update transaction if transaction is not found', async () => {
    const mockVirtualAccount = { id: 1, user_id: 'user-1' };
    TransferWebhookModel.findVirtualAccountByNumber.mockResolvedValue(mockVirtualAccount);
    TransferWebhookModel.findTransactionByReference.mockResolvedValue(null);

    await handle(mockPayload);

    expect(TransferWebhookModel.updateTransaction).not.toHaveBeenCalled();
  });
});
