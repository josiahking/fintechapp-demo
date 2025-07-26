/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('webhook_events', (table) => {
    table.increments('id').primary();
    table.string('event_type').notNullable(); 
    table.string('status').notNullable(); 
    table.json('payload').notNullable(); 
    table.timestamp('received_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('webhook_events');
};
