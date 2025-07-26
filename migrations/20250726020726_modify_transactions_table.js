/**
 * Migration to alter the 'transactions' table:
 * - Updates enum for 'type' field to use 'debit' and 'credit'.
 * - Alters 'description' column to include a comment.
 * - Adds new columns: 'currency', 'session_id', and 'category'.
 *
 * @param { import("knex").Knex } knex - The Knex.js instance for running the migration.
 * @returns { Promise<void> } A promise that resolves when the changes are applied.
 */
exports.up = async function (knex) {
  await knex.schema.alterTable('transactions', table => {
    table.enum('type', ['debit', 'credit']).alter(); // Changed enum from ['deposit', 'transfer'] to ['debit', 'credit']
    table.text('description').comment('Transaction narration').alter(); // Adds comment to description field
    table.string('currency', 3).notNullable(); // ISO currency code, e.g. 'NGN', 'USD'
    table.string('session_id'); // Optional session reference for tracing source
    table
      .enum('category', [
        'bank_transfer',
        'card_payment',
        'bill_payment',
        'refund',
        'collection',
      ])
      .notNullable(); // Defines the category or purpose of transaction
  });
};

/**
 * Rollback migration to revert the changes made in the `up` function.
 *
 * @param { import("knex").Knex } knex - The Knex.js instance for rolling back the migration.
 * @returns { Promise<void> } A promise that resolves when the rollback is completed.
 */
exports.down = async function (knex) {
  await knex.schema.alterTable('transactions', table => {
    table.dropColumn('currency');
    table.dropColumn('session_id');
    table.dropColumn('category');
  });
};
