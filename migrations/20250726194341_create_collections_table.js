/**
 * Run the migration to create the `collections` table.
 * This table stores records of incoming payment collections linked to users,
 * virtual accounts, and associated transactions.
 *
 * @param { import("knex").Knex } knex - The Knex.js instance.
 * @returns { Promise<void> } A promise that resolves once the table is created.
 */
exports.up = function (knex) {
  return knex.schema.createTable('collections', table => {
    table.uuid('id').primary()
      .comment('Primary key identifier for the collection record');

    table.uuid('user_id').notNullable()
      .references('id').inTable('users').onDelete('CASCADE')
      .comment('References the user who owns the collection');

    table.uuid('account_id').notNullable()
      .references('id').inTable('virtual_accounts').onDelete('CASCADE')
      .comment('References the virtual account to which the funds were collected');

    table.uuid('transaction_id').notNullable()
      .references('id').inTable('transactions').onDelete('CASCADE')
      .comment('References the transaction that represents the collection');

    table.string('account_number').notNullable()
      .comment('The sender’s or linked bank account number');

    table.string('first_name').notNullable()
      .comment('First name of the sender');

    table.string('last_name').nullable()
      .comment('Last name of the sender');

    table.string('bank').notNullable()
      .comment('Name of the sender’s bank');

    table.string('bank_code').notNullable()
      .comment('Unique bank code identifier');

    table.decimal('amount', 14, 2).notNullable()
      .comment('Amount collected in the transaction');

    table.text('description').nullable()
      .comment('Optional description or narration for the collection');

    table.timestamps(true, true)
      .comment('Timestamps for created_at and updated_at');
  });
};

/**
 * Rollback the migration by dropping the `collections` table.
 *
 * @param { import("knex").Knex } knex - The Knex.js instance.
 * @returns { Promise<void> } A promise that resolves once the table is dropped.
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('collections');
};
