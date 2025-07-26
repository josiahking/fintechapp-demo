const knex = require('../../knex');
const { v4: uuidv4 } = require('uuid');

const findVirtualAccountByNumber = async (accountNumber) => {
  return knex('virtual_accounts')
    .where({ account_number: accountNumber })
    .first();
};

const findTransactionByReference = async (reference) => {
  return knex('transactions')
    .where({ reference })
    .first();
};

const currency = 'NGN';

const createTransaction = async (data) => {
  const id = uuidv4();
  return knex('transactions').insert({
    id: uuidv4(),
    user_id: data.user_id,
    type: data.type,
    amount: data.amount,
    reference: data.reference,
    currency: currency,
    description: data.narration,
    status: data.status,
    category: data.category,
    session_id: data.session_id,
    created_at: new Date(),
    updated_at: new Date()
  });
  return id;
};

const createCollectionSource = async (receiver, user_id, amount, data) => {
  return knex('collections').insert({
    id: uuidv4(),
    user_id: user_id,
    account_id: receiver,
    amount: amount,
    account_number: data.account_number,
    first_name: data.first_name,
    description: data.narration,
    last_name: data.last_name,
    bank: data.bank,
    bank_code: data.bank_code,
    created_at: new Date(),
    updated_at: new Date()
  });
};

module.exports = {
  findVirtualAccountByNumber,
  findTransactionByReference,
  createTransaction,
  createCollectionSource
};
