const request = require('supertest');
const app = require('../src/app');
const knex = require('knex')(require('../knexfile').development);

// Run DB migrations before all tests
beforeAll(async () => {
    await knex.migrate.rollback();  // Rollback to ensure a clean state
    await knex.migrate.latest();    // Apply latest migrations
}, 20000); // Optional: increase timeout for slower DB setup

// Destroy DB connection after all tests
afterAll(async () => {
    await knex.destroy();
});

describe('Auth Endpoints', () => {
    // Test user details
    let userData = {
        full_name: "Test User",
        email: "test@example.com",
        password: "secret123@"
    };

    /**
     * Test: Register a new user
     */
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send(userData);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('token'); // Successful signup returns JWT
    });

    /**
     * Test: Login with correct credentials
     */
    it('should login an existing user', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: userData.email,
                password: userData.password
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token'); // Successful login returns JWT
    });

    /**
     * Test: Prevent duplicate registrations
     */
    it('should not allow duplicate user signup', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send(userData);

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message'); // Expected error message
    });

    /**
     * Test: Reject login with invalid password
     */
    it('should fail login with wrong credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: userData.email,
                password: "wrongpass"
            });

        expect(res.statusCode).toBe(401); // Unauthorized
    });
});
