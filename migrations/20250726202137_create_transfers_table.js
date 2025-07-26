/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('transfers', table => {
    table.uuid('id').primary()
    table
      .uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
    table
      .uuid('transaction_id')
      .notNullable()
      .references('id')
      .inTable('transactions')
      .onDelete('CASCADE')
    table.string('account_number').notNullable();
    table.string('account_name').notNullable();
    table.string('currency', 3).notNullable();
    table.string('merchant_ref').notNullable();
    table.string('bank').notNullable();
    table.string('bank_code').notNullable();
    table.decimal('amount', 14, 2).notNullable()
    table.integer('fee').defaultTo(0)
    table.text('description').nullable()
    table.timestamps(true, true)
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('transfers')
};
