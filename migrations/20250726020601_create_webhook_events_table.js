/**
 * Migration to create the 'webhook_events' table.
 *
 * @param { import("knex").Knex } knex - The Knex instance used to build the schema.
 * @returns { Promise<void> } A promise that resolves when the table is created.
 */
exports.up = function(knex) {
  return knex.schema.createTable('webhook_events', (table) => {
    table.increments('id').primary(); // Auto-incrementing primary key

    table.string('event_type').notNullable(); // Describes the type of webhook event (e.g. 'transfer', 'collection', etc.)

    table.string('status').notNullable(); // Status of the webhook (e.g. 'processed', 'pending', 'failed')

    table.json('payload').notNullable(); // The full raw JSON payload received from the webhook

    table.timestamp('received_at').defaultTo(knex.fn.now()); // Timestamp when the event was received
  });
};

/**
 * Rollback function to drop the 'webhook_events' table.
 *
 * @param { import("knex").Knex } knex - The Knex instance used to rollback the schema.
 * @returns { Promise<void> } A promise that resolves when the table is dropped.
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('webhook_events');
};
