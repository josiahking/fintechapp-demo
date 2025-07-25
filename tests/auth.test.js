const request = require('supertest');
const app = require('../src/app');
const knex = require('knex')(require('../knexfile').development);

beforeAll(async () => {
    await knex.migrate.rollback();
    await knex.migrate.latest();
}, 10000);

afterAll(async () => {
    await knex.destroy();
});

describe('Auth Endpoints', () => {
    let userData = {
        full_name: "Test User",
        email: "test@example.com",
        password: "secret123@"
    };

    it('should register a new user', async () => {
        const res = await request(app).post('/api/auth/signup').send(userData);
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('token');
    });

    it('should login an existing user', async () => {
        const res = await request(app).post('/api/auth/login').send({
            email: userData.email,
            password: userData.password
        });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should fail login with wrong credentials', async () => {
        const res = await request(app).post('/api/auth/login').send({
            email: userData.email,
            password: "wrongpass"
        });
        expect(res.statusCode).toBe(401);
    });
});
