/**
 * Run the migration to create the `transfers` table.
 * This table tracks outgoing fund transfers initiated by users, 
 * including recipient bank details and linkage to the original transaction.
 *
 * @param { import("knex").Knex } knex - The Knex.js instance.
 * @returns { Promise<void> } A promise that resolves once the table is created.
 */
exports.up = function(knex) {
  return knex.schema.createTable('transfers', table => {
    table.uuid('id').primary()
      .comment('Primary key identifier for the transfer record');

    table.uuid('user_id').notNullable()
      .references('id').inTable('users').onDelete('CASCADE')
      .comment('References the user initiating the transfer');

    table.uuid('transaction_id').notNullable()
      .references('id').inTable('transactions').onDelete('CASCADE')
      .comment('References the transaction associated with this transfer');

    table.string('account_number').notNullable()
      .comment('Destination bank account number');

    table.string('account_name').notNullable()
      .comment('Recipient name for the destination account');

    table.string('currency', 3).notNullable()
      .comment('3-letter currency code (e.g., NGN, USD) for the transfer');

    table.string('merchant_ref').notNullable()
      .comment('Unique reference string used for external tracking (e.g., payment processor)');

    table.string('bank').notNullable()
      .comment('Name of the recipient bank');

    table.string('bank_code').notNullable()
      .comment('Bank’s unique code identifier (used in APIs or integrations)');

    table.decimal('amount', 14, 2).notNullable()
      .comment('Amount transferred');

    table.integer('fee').defaultTo(0)
      .comment('Transaction fee charged for the transfer');

    table.text('description').nullable()
      .comment('Optional narration or description of the transfer');

    table.timestamps(true, true)
      .comment('Timestamps for created_at and updated_at');
  });
};

/**
 * Rollback the migration by dropping the `transfers` table.
 *
 * @param { import("knex").Knex } knex - The Knex.js instance.
 * @returns { Promise<void> } A promise that resolves once the table is dropped.
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('transfers');
};
