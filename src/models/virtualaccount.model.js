const knex = require('../../knex')
const { v4: uuidv4 } = require('uuid');

const VirtualAccount = {
  async create ({ user_id, account_number, bank_name, account_name }) {
    return knex('virtual_accounts').insert({
      id: uuidv4(),
      user_id,
      account_number,
      bank_name,
      account_name
    })
  },

  async findByUserId (user_id) {
    return knex('virtual_accounts').where({ user_id }).first()
  }
}

module.exports = VirtualAccount
