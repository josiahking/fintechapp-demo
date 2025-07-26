const knex = require('../../knex');
const { v4: uuidv4 } = require('uuid');

const VirtualAccount = {
  /**
   * Creates a new virtual account for a user.
   * @param {Object} params
   * @param {string} params.user_id - The ID of the user.
   * @param {string} params.account_number - The virtual account number.
   * @param {string} params.bank_name - The bank name of the virtual account.
   * @param {string} params.account_name - The account name.
   * @returns {Promise<void>} - Resolves when the account is created.
   */
  async create({ user_id, account_number, bank_name, account_name }) {
    return knex('virtual_accounts').insert({
      id: uuidv4(),
      user_id,
      account_number,
      bank_name,
      account_name
    });
  },

  /**
   * Retrieves the virtual account for a specific user.
   * @param {string} user_id - The ID of the user.
   * @returns {Promise<Object|null>} - The virtual account or null if not found.
   */
  async findByUserId(user_id) {
    return knex('virtual_accounts')
      .where({ user_id })
      .first();
  }
};

module.exports = VirtualAccount;
