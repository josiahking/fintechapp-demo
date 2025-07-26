/**
 * Adds a `balance` column to the `virtual_accounts` table if it doesn't already exist.
 *
 * @param { import("knex").Knex } knex - The Knex.js instance.
 * @returns { Promise<void> } A promise that resolves when the migration is complete.
 */
exports.up = async function(knex) {
  const tableName = 'virtual_accounts';
  const columnName = 'balance';

  // Check if the column already exists to avoid migration errors
  const exists = await knex.schema.hasColumn(tableName, columnName);
  if (!exists) {
    await knex.schema.alterTable(tableName, table => {
      table.decimal(columnName, 14, 2).defaultTo(0)
        .comment('Stores current balance of the virtual account');
    });
  }
};

/**
 * Drops the `balance` column from the `virtual_accounts` table if it exists.
 *
 * @param { import("knex").Knex } knex - The Knex.js instance.
 * @returns { Promise<void> } A promise that resolves when the rollback is complete.
 */
exports.down = async function(knex) {
  const tableName = 'virtual_accounts';
  const columnName = 'balance';

  // Check if the column exists before attempting to drop it
  const exists = await knex.schema.hasColumn(tableName, columnName);
  if (exists) {
    await knex.schema.alterTable(tableName, table => {
      table.dropColumn(columnName);
    });
  }
};
