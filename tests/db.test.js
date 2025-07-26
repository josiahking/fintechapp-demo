// Import and initialize Knex with the development environment configuration
const knex = require('knex')(require('../knexfile').development);

describe('Database connection', () => {
    /**
     * This test checks if the database is connected and working properly
     * by executing a raw SQL query: SELECT 1+1 AS result.
     * It expects the result to be 2.
     */
    it('should connect and select 1', async () => {
        const result = await knex.raw('SELECT 1+1 AS result'); // Execute test query
        expect(result[0][0].result).toBe(2); // Validate the returned result
    });

    /**
     * After all tests run, close the database connection
     * to prevent open handles and ensure a clean test exit.
     */
    afterAll(async () => {
        await knex.destroy(); // Cleanup DB connection
    });
});
