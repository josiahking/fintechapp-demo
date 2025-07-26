const request = require('supertest');
const app = require('../src/app'); // Adjust this path to your Express app
const knex = require('../knex');   // Your configured knex instance
require('dotenv').config();

const validSecret = process.env.RAVEN_WEBHOOK_SECRET || 'your_webhook_secret_key'; // same as used in handler

describe('Raven Webhook Handler', () => {
  const baseUrl = '/webhook';

  beforeEach(async () => {
    await knex('webhook_events').truncate();
  });

  afterAll(async () => {
    await knex.destroy();
  });

  it('should process a successful transfer correctly', async () => {
    const payload = {
      merchant_ref: '202209082013GAEGBCB',
      meta: {
        account_name: 'John Doe Company',
        account_number: '12345678911',
        narration: 'transfer narration',
        currency: 'NGN',
        amount: 5000
      },
      trx_ref: '202209082013HEIBIFD',
      secret: validSecret,
      status: 'successful',
      session_id: '090305220908201401138651852193',
      type: 'transfer',
      response: 'Transfer successful'
    };

    const res = await request(app).post(baseUrl).send(payload);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('received', true);
  });

  it('should process a failed transfer correctly', async () => {
    const payload = {
      merchant_ref: '8267995',
      meta: {
        account_name: 'JOHN DOE',
        account_bank: null,
        account_number: '208343221248',
        narration: 'Transfer',
        currency: 'NGN',
        amount: 200
      },
      trx_ref: '202208090425BAAFJHI',
      secret: validSecret,
      status: 'failed',
      type: 'transfer',
      response: 'Transfer failed'
    };

    const res = await request(app).post(baseUrl).send(payload);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('received', true);
  });

  it('should reject webhook with invalid secret', async () => {
    const payload = {
      merchant_ref: '111',
      meta: {
        account_name: 'Fake Name',
        account_number: '0000000000',
        narration: 'Fake transfer',
        currency: 'NGN',
        amount: 100
      },
      trx_ref: '0000000000',
      secret: 'invalid_secret',
      status: 'successful',
      type: 'transfer',
      response: 'Transfer successful'
    };

    const res = await request(app).post(baseUrl).send(payload);

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error', 'Invalid webhook secret');
  });

  it('should return 400 for missing fields', async () => {
    const incompletePayload = {
      secret: validSecret,
      status: 'successful',
      type: 'transfer'
    };

    const res = await request(app).post(baseUrl).send(incompletePayload);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should log the webhook payload successfully to the database', async () => {
    const testPayload = {
      merchant_ref: '202209082013GAEGBCB',
      meta: {
        account_name: 'John Doe Company',
        account_number: '12345678911',
        narration: 'transfer narration',
        currency: 'NGN',
        amount: 5000
      },
      trx_ref: '202209082013HEIBIFD',
      secret: process.env.RAVEN_WEBHOOK_SECRET || 'your_webhook_secret_key',
      status: 'successful',
      session_id: '090305220908201401138651852193',
      type: 'transfer',
      response: 'Transfer successful'
    };

    const res = await request(app)
      .post(baseUrl)
      .send(testPayload);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('received', true);

    const logs = await knex('webhook_events').select('*');
    expect(logs.length).toBe(1);

    const log = logs[0];
    expect(log.event_type).toBe('transfer');
    expect(log.status).toBe('successful');
  });

});
