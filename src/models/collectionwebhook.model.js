const knex = require('../../knex');
const { v4: uuidv4 } = require('uuid');

const currency = 'NGN';

/**
 * Find virtual account by account number
 * @param {string} accountNumber
 * @returns {Promise<Object|null>}
 */
const findVirtualAccountByNumber = async (accountNumber) => {
  return knex('virtual_accounts')
    .where({ account_number: accountNumber })
    .first();
};

/**
 * Find a transaction by its reference
 * @param {string} reference
 * @returns {Promise<Object|null>}
 */
const findTransactionByReference = async (reference) => {
  return knex('transactions')
    .where({ reference })
    .first();
};

/**
 * Create a new transaction
 * @param {Object} data
 * @returns {Promise<string>} - UUID of inserted transaction
 */
const createTransaction = async (data) => {
  const id = uuidv4();
  await knex('transactions').insert({
    id,
    user_id: data.user_id,
    type: data.type,
    amount: data.amount,
    reference: data.reference,
    currency,
    description: data.narration,
    status: data.status,
    category: data.category,
    session_id: data.session_id,
    created_at: new Date(),
    updated_at: new Date()
  });
  return id; // previously unreachable due to return above insert
};

/**
 * Log the collection source to 'collections' table
 * @param {string} receiver - Account ID
 * @param {string} user_id - User ID
 * @param {number} amount - Amount received
 * @param {Object} data - Additional metadata
 * @returns {Promise<void>}
 */
const createCollectionSource = async (receiver, user_id, amount, data) => {
  await knex('collections').insert({
    id: uuidv4(),
    user_id,
    account_id: receiver,
    amount,
    account_number: data.account_number,
    first_name: data.first_name,
    last_name: data.last_name,
    description: data.narration,
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
