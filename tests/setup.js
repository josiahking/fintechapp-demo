// test/setup.js or inside the same test file
const knex = require('../knex');
const jwt = require('jsonwebtoken');
const { hashPassword } = require('../src/utils/hash');

const testUser = {
  id: 'test-user-id',
  first_name: 'Test',
  last_name: 'User',
  email: 'testuser@example.com',
  phone: '08012345678',
  password: 'testpassword123',
};

async function createTestUser() {
  const password_hash = await hashPassword(testUser.password);
  const userData = {
    id: testUser.id,
    full_name: `${testUser.first_name} ${testUser.last_name}`,
    email: testUser.email,
    password_hash,
  };

  await knex('users').insert(userData);

  const token = jwt.sign({ id: testUser.id }, process.env.JWT_SECRET || 'testsecret');
  return { user: testUser, token };
}

module.exports = {
  createTestUser,
  testUser,
};
