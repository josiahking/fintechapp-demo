const knex = require('../../knex');

/**
 * Safely updates the balance of a virtual account.
 *
 * @param {Object} virtualAccount - The virtual account object from the database.
 * @param {number} amount - The amount to update the balance by.
 * @param {'debit' | 'credit'} type - The type of transaction to apply.
 * @returns {Promise<number>} - The updated balance after the transaction.
 * @throws {Error} - If inputs are invalid or balance is insufficient.
 */
const handleBalanceUpdate = async (virtualAccount, amount, type) => {
  if (!virtualAccount?.id) {
    throw new Error('Missing or invalid virtual account');
  }

  if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
    throw new Error('Invalid amount');
  }

  if (!['debit', 'credit'].includes(type)) {
    throw new Error('Invalid transaction type');
  }

  const numericAmount = toDecimal(amount);
  const currentBalance = toDecimal(virtualAccount.balance || 0);

  let newBalance = currentBalance;

  if (type === 'credit') {
    newBalance += numericAmount;
  } else {
    if (numericAmount > currentBalance) {
      throw new Error('Insufficient balance');
    }
    newBalance -= numericAmount;
  }

  newBalance = toDecimal(newBalance); // Ensure it’s still properly rounded

  await knex('virtual_accounts')
    .where({ id: virtualAccount.id })
    .update({
      balance: newBalance,
      updated_at: new Date()
    });

  return newBalance;
};

/**
 * Converts a number to a 2-decimal float.
 *
 * @param {number|string} value - The value to format.
 * @returns {number} - A number rounded to 2 decimal places.
 * @throws {Error} - If the input is not a valid number.
 */
function toDecimal(value) {
  const num = parseFloat(value);
  if (isNaN(num)) {
    throw new Error('Invalid decimal value');
  }
  return parseFloat(num.toFixed(2));
}

module.exports = { handleBalanceUpdate, toDecimal };
