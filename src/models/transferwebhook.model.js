const knex = require('../../knex');
const { v4: uuidv4 } = require('uuid');

/**
 * Find a virtual account by its account number.
 * @param {string} accountNumber - The account number to search for.
 * @returns {Promise<Object|null>} - Virtual account record or null.
 */
const findVirtualAccountByNumber = async (accountNumber) => {
  return knex('virtual_accounts')
    .where({ account_number: accountNumber })
    .first();
};

/**
 * Find a transaction by its reference.
 * @param {string} reference - The transaction reference string.
 * @returns {Promise<Object|null>} - Matching transaction record or null.
 */
const findTransactionByReference = async (reference) => {
  return knex('transactions')
    .where({ reference })
    .first();
};

/**
 * Update transaction status and session ID using the reference.
 * @param {string} reference - The transaction reference to identify the row.
 * @param {Object} data - Data to update (expects { status, session_id }).
 * @returns {Promise<number>} - Number of rows updated.
 */
const updateTransaction = async (reference, data) => {
  return knex('transactions')
    .where({ reference })
    .update({
      status: data.status,
      session_id: data.session_id,
      updated_at: new Date()
    });
};

module.exports = {
  findVirtualAccountByNumber,
  findTransactionByReference,
  updateTransaction
};
