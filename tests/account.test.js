const knex = require('../knex');
const { createTestUser, testUser } = require('./setup');
const axios = require('axios');
const request = require('supertest');
const app = require('../src/app');

// Mock external HTTP requests (e.g., Raven API)
jest.mock('axios');

let token;

describe('Virtual Account Creation Test', () => {
  /**
   * Setup DB and create test user before all tests
   */
  beforeAll(async () => {
    // Reset database state
    await knex.migrate.rollback();
    await knex.migrate.latest();

    // Create and authenticate test user
    const setup = await createTestUser();
    token = setup.token;
  }, 20000); // Optional timeout for DB setup

  /**
   * Cleanup DB after all tests
   */
  afterAll(async () => {
    await knex('users').where({ id: testUser.id }).del();
    await knex.destroy();
  });

  /**
   * Test: Successful virtual account creation
   */
  it('should create a virtual account and return account details', async () => {
    // Mock Raven API response
    axios.post.mockResolvedValueOnce({
      data: {
        data: {
          account_number: '1234567890',
          bank: 'Test Bank',
          account_name: 'Test User',
        },
      },
    });

    const res = await request(app)
      .post('/api/accounts/create')
      .set('Authorization', `Bearer ${token}`) // Auth header
      .send({
        first_name: 'Test',
        last_name: 'User',
        email: 'testuser@example.com',
        phone: '08012345678',
        amount: 1000,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('account_number', '1234567890');
    expect(res.body.data).toHaveProperty('bank', 'Test Bank');
    expect(res.body.data).toHaveProperty('account_name', 'Test User');
  });

  /**
   * Test: Missing required fields
   */
  it('should return 400 if required fields are missing', async () => {
    const res = await request(app)
      .post('/api/accounts/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        // Only email sent; other required fields missing
        email: 'incomplete@example.com',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
