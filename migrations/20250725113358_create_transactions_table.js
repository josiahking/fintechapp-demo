/**
 * Migration to create the 'transactions' table.
 *
 * @param { import("knex").Knex } knex - The Knex instance used for schema building.
 * @returns { Promise<void> } A promise that resolves when the table is successfully created.
 */
exports.up = function(knex) {
  return knex.schema.createTable('transactions', table => {
    table.uuid('id').primary(); // Unique identifier for each transaction

    table.uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE'); // Foreign key to users table. Cascade deletes to maintain data integrity

    table.enum('type', ['deposit', 'transfer']).notNullable(); // Type of transaction

    table.decimal('amount', 14, 2).notNullable(); // Monetary value of the transaction (up to 999 trillion with 2 decimals)

    table.enum('status', ['success', 'pending', 'failed']).notNullable(); // Status of the transaction

    table.string('reference').notNullable(); // Unique reference for tracking the transaction (e.g. from payment gateway)

    table.text('description').nullable(); // Optional field for transaction description, narration, or metadata

    table.timestamps(true, true); // Adds created_at and updated_at columns with default current timestamps
  });
};

/**
 * Rollback function to drop the 'transactions' table.
 *
 * @param { import("knex").Knex } knex - The Knex instance used for schema rollback.
 * @returns { Promise<void> } A promise that resolves when the table is dropped.
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('transactions');
};
