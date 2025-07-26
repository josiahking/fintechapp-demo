const knex = require('../knex')
const { createTestUser, testUser } = require('./setup');
const axios = require('axios')
const request = require('supertest')
const app = require('../src/app')

jest.mock('axios')

let token

describe('User Creation Test', () => {

  beforeAll(async () => {
    await knex.migrate.rollback()
    await knex.migrate.latest()

    const setup = await createTestUser();
    token = setup.token;
  }, 20000)

  afterAll(async () => {
    await knex('users').where({ id: testUser.id }).del()
    await knex.destroy()
  })

  it('should create a virtual account and return account details', async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        data: {
          account_number: '1234567890',
          bank: 'Test Bank',
          account_name: 'Test User'
        }
      }
    })

    const res = await request(app)
      .post('/api/accounts/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        first_name: 'Test',
        last_name: 'User',
        email: 'testuser@example.com',
        phone: '08012345678',
        amount: 1000
      })

    expect(res.statusCode).toBe(200)
    expect(res.body.data).toHaveProperty('account_number', '1234567890')
    expect(res.body.data).toHaveProperty('bank', 'Test Bank')
    expect(res.body.data).toHaveProperty('account_name', 'Test User')
  })

  it('should return 400 if required fields are missing', async () => {
    const res = await request(app)
      .post('/api/accounts/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        // Missing first_name, last_name, etc.
        email: 'incomplete@example.com'
      })

    expect(res.statusCode).toBe(400)
    expect(res.body).toHaveProperty('error')
  })
})
