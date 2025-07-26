/**
 * @file Utility module for setting up test users and authentication tokens.
 * Used across test suites to seed the database with a mock user and generate a valid JWT.
 */

const knex = require('../knex');
const jwt = require('jsonwebtoken');
const { hashPassword } = require('../src/utils/hash');

/**
 * Mock user object used for testing.
 * @type {Object}
 */
const testUser = {
  id: 'test-user-id',
  first_name: 'Test',
  last_name: 'User',
  email: 'testuser@example.com',
  phone: '08012345678',
  password: 'testpassword123',
};

/**
 * Inserts a test user into the database and returns a valid JWT token.
 *
 * @async
 * @function createTestUser
 * @returns {Promise<{user: Object, token: string}>} - Returns the test user and their JWT token.
 */
async function createTestUser() {
  // Hash the plaintext password
  const password_hash = await hashPassword(testUser.password);

  // Format data for DB insertion
  const userData = {
    id: testUser.id,
    full_name: `${testUser.first_name} ${testUser.last_name}`,
    email: testUser.email,
    password_hash,
  };

  // Insert user into the database
  await knex('users').insert(userData);

  // Generate a JWT token for the inserted user
  const token = jwt.sign(
    { id: testUser.id },
    process.env.JWT_SECRET || 'testsecret' // fallback secret
  );

  return { user: testUser, token };
}

// Export the helper function and test user object
module.exports = {
  createTestUser,
  testUser,
};
