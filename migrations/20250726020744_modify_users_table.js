/**
 * Migration to remove the `balance` column from the `users` table.
 *
 * @param { import("knex").Knex } knex - The Knex.js instance for running the migration.
 * @returns { Promise<void> } A promise that resolves when the column is removed.
 */
exports.up = async function(knex) {
  const tableName = 'users';
  const columnName = 'balance';

  // Check if the 'balance' column exists before attempting to drop it
  const exists = await knex.schema.hasColumn(tableName, columnName);
  if (exists) {
    await knex.schema.alterTable(tableName, table => {
      table.dropColumn(columnName);
    });
  }
};

/**
 * Rollback migration to re-add the `balance` column to the `users` table.
 *
 * @param { import("knex").Knex } knex - The Knex.js instance for rolling back the migration.
 * @returns { Promise<void> } A promise that resolves when the column is restored.
 */
exports.down = async function(knex) {
  const tableName = 'users';
  const columnName = 'balance';

  // Check if the column does not exist before re-adding
  const exists = await knex.schema.hasColumn(tableName, columnName);
  if (!exists) {
    await knex.schema.alterTable(tableName, table => {
      table.decimal(columnName, 14, 2).defaultTo(0);
    });
  }
};
