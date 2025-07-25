/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', table => {
    table.uuid('id').primary();
    table.string('full_name').notNullable();
    table.string('email').unique().notNullable();
    table.string('password_hash').notNullable();
    table.decimal('balance', 14, 2).defaultTo(0);
    table.timestamps(true, true); // created_at and updated_at
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};
