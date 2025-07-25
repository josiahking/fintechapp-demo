const knex = require('knex')(require('../knexfile').development);

describe('Database connection', () => {
    it('should connect and select 1', async () => {
        const result = await knex.raw('SELECT 1+1 AS result');
        expect(result[0][0].result).toBe(2);
    });

    afterAll(async () => {
        await knex.destroy();
    });
});
