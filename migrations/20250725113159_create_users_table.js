/**
 * Run the migrations: Create the 'users' table.
 *
 * @param { import("knex").Knex } knex - The Knex instance for running schema operations.
 * @returns { Promise<void> } A promise that resolves when the table has been created.
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', table => {
    table.uuid('id').primary(); // Unique identifier for the user (UUID format)
    table.string('full_name').notNullable(); // User's full name
    table.string('email').unique().notNullable(); // User's email, must be unique
    table.string('password_hash').notNullable(); // Hashed password for secure storage
    table.decimal('balance', 14, 2).defaultTo(0); // User's balance with precision (e.g. for Naira)
    table.timestamps(true, true); // Adds created_at and updated_at columns with automatic updates
  });
};

/**
 * Rollback the migrations: Drop the 'users' table if it exists.
 *
 * @param { import("knex").Knex } knex - The Knex instance for running schema operations.
 * @returns { Promise<void> } A promise that resolves when the table has been dropped.
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};
