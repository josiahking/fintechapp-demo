const knex = require('../../knex');

/**
 * Find a user by their email address.
 *
 * @param {string} email - The user's email.
 * @returns {Promise<Object|null>} - User record or null if not found.
 */
exports.getUserByEmail = (email) => {
  return knex('users').where({ email }).first();
};

/**
 * Insert a new user into the database.
 *
 * @param {Object} user - User data (must include required fields like id, email, password, etc.).
 * @returns {Promise<Array>} - Insert result (usually an array of inserted IDs).
 */
exports.createUser = (user) => {
  return knex('users').insert(user);
};
