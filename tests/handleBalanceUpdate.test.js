/**
 * @file Test suite for balance update utility functions.
 * It validates correct behavior of handleBalanceUpdate and toDecimal.
 */

const knex = require('../knex');
const { handleBalanceUpdate, toDecimal } = require('../src/utils/handleBalanceUpdate');
const { createTestUser, testUser } = require('./setup');
const { v4: uuidv4 } = require('uuid');

describe('handleBalanceUpdate with type', () => {
  let virtualAccount;
  let token;

  /**
   * Runs once before all tests.
   * - Rolls back and reapplies migrations
   * - Seeds the database with a test user
   */
  beforeAll(async () => {
    await knex.migrate.rollback();
    await knex.migrate.latest();
    
    const setup = await createTestUser();
    token = setup.token;
  });

  /**
   * Runs before each individual test.
   * - Truncates virtual_accounts table
   * - Inserts a fresh virtual account for a test user
   */
  beforeEach(async () => {
    await knex('virtual_accounts').truncate();

    const uuid = uuidv4();
    const [id] = await knex('virtual_accounts')
      .insert({
        id: uuid,
        user_id: testUser.id,
        account_number: '1234567890',
        account_name: 'Test Account',
        balance: 1000, // Initial balance
        bank_name: 'Beststar',
        created_at: new Date(),
        updated_at: new Date()
      });

    virtualAccount = await knex('virtual_accounts').where({ id: uuid }).first();
  });

  /**
   * Cleans up after all tests
   * - Deletes test user and closes DB connection
   */
  afterAll(async () => {
    await knex('users').where({ id: testUser.id }).del();
    await knex.destroy();
  });

  it('should credit balance correctly', async () => {
    const newBalance = await handleBalanceUpdate(virtualAccount, 300.25, 'credit');
    expect(newBalance).toBeCloseTo(1300.25, 2);

    const updated = await knex('virtual_accounts').where({ id: virtualAccount.id }).first();
    expect(Number(updated.balance)).toBeCloseTo(1300.25, 2);
  });

  it('should debit balance correctly', async () => {
    const newBalance = await handleBalanceUpdate(virtualAccount, 400.50, 'debit');
    expect(newBalance).toBeCloseTo(599.50, 2);

    const updated = await knex('virtual_accounts').where({ id: virtualAccount.id }).first();
    expect(Number(updated.balance)).toBeCloseTo(599.50, 2);
  });

  it('should throw on overdraft', async () => {
    await expect(handleBalanceUpdate(virtualAccount, 2000.00, 'debit')).rejects.toThrow('Insufficient balance');
  });

  it('should throw on invalid type', async () => {
    await expect(handleBalanceUpdate(virtualAccount, 200.00, 'bonus')).rejects.toThrow('Invalid type parameter');
  });

  it('should throw on invalid amount', async () => {
    await expect(handleBalanceUpdate(virtualAccount, 'abc', 'credit')).rejects.toThrow('Invalid amount');
  });

  it('should throw on missing virtual account', async () => {
    await expect(handleBalanceUpdate(null, 100.00, 'debit')).rejects.toThrow('Missing virtual account');
  });
});

describe('toDecimal', () => {
  /**
   * Tests for `toDecimal` utility
   * Ensures values are properly rounded to two decimal places
   */
  it('should convert valid numbers to 2 decimal places', () => {
    expect(toDecimal(100)).toBe(100.00);
    expect(toDecimal('200.789')).toBe(200.79);
    expect(toDecimal(999.999)).toBe(1000.00);
  });

  it('should throw on invalid input', () => {
    expect(() => toDecimal('abc')).toThrow('Invalid decimal value');
    expect(() => toDecimal(null)).toThrow('Invalid decimal value');
  });
});
