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
