/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('collections', table => {
    table.uuid('id').primary()
    table
      .uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
    table
      .uuid('account_id')
      .notNullable()
      .references('id')
      .inTable('virtual_accounts')
      .onDelete('CASCADE')
    table
      .uuid('transaction_id')
      .notNullable()
      .references('id')
      .inTable('transactions')
      .onDelete('CASCADE')
    table.string('account_number').notNullable();
    table.string('first_name').notNullable();
    table.string('last_name').nullable();
    table.string('bank').notNullable();
    table.string('bank_code').notNullable();
    table.decimal('amount', 14, 2).notNullable()
    table.text('description').nullable()
    table.timestamps(true, true)
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('collections')
}
