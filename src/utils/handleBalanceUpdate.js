const knex = require('../../knex');

/**
 * Update virtual account balance based on transaction type.
 *
 * @param {Object} virtualAccount - The virtual account object.
 * @param {number} amount - The amount to add or deduct.
 * @param {'debit' | 'credit'} type - The type of transaction.
 * @returns {Promise<number>} - The new balance.
 */
const handleBalanceUpdate = async (virtualAccount, amount, type) => {
  if (!virtualAccount) {
    throw new Error('Missing virtual account');
  }

  if (typeof amount !== 'number') {
    throw new Error('Invalid amount');
  }

  if (!['debit', 'credit'].includes(type)) {
    throw new Error('Invalid type parameter');
  }

  const numericAmount = toDecimal(amount);
  const currentBalance = toDecimal(virtualAccount.balance);
  let newBalance;

  if (type === 'credit') {
    newBalance = toDecimal(currentBalance + numericAmount);
  } else if (type === 'debit') {
    if (numericAmount > currentBalance) {
      throw new Error('Insufficient balance');
    }
    newBalance = toDecimal(currentBalance - numericAmount);
  }

  if (newBalance < 0) {
    throw new Error('Insufficient balance');
  }

  await knex('virtual_accounts')
    .where({ id: virtualAccount.id })
    .update({
      balance: newBalance,
      updated_at: new Date()
    });

  return newBalance;
};

/**
 * Convert number to proper value for transaction
 * @param {number} value 
 * @returns 
 */

function toDecimal(value) {
  const num = parseFloat(value);
  if (isNaN(num)) throw new Error('Invalid decimal value');
  return parseFloat(num.toFixed(2));
}

module.exports = { handleBalanceUpdate, toDecimal };
