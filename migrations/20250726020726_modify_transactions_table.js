/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.alterTable('transactions', table => {
    table.enum('type', ['debit', 'credit']).alter();
    table.text('description').comment('Transaction narration').alter();
    table.string('currency', 3).notNullable();
    table.string('session_id');
    table
      .enum('category', [
        'bank_transfer',
        'card_payment',
        'bill_payment',
        'refund',
        'collection',
      ])
      .notNullable()
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.alterTable('transactions', table => {
    table.dropColumn('currency');
    table.dropColumn('session_id');
    table.dropColumn('category');
  });
}
