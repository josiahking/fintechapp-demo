/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const tableName = 'virtual_accounts';

  const exists = await knex.schema.hasColumn(tableName, 'balance');
  if (!exists) {
    await knex.schema.alterTable(tableName, table => {
      table.decimal('balance', 14, 2).defaultTo(0);
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  const tableName = 'virtual_accounts';
  const columnName = 'balance';

  const exists = await knex.schema.hasColumn(tableName, columnName);
  if (exists) {
    await knex.schema.alterTable(tableName, table => {
      table.dropColumn(columnName);
    });
  }
};
