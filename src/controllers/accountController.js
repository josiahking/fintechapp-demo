const axios = require('axios');
const knex = require('../../knex');
const VirtualAccount = require('../models/virtualaccount.model');
require('dotenv').config();

/**
 * Create a virtual account for the authenticated user using the Raven API.
 *
 * This function:
 * 1. Retrieves the authenticated user's ID from `req.user`.
 * 2. Validates the user exists in the database.
 * 3. Sends a POST request to the Raven API to generate a new virtual account.
 * 4. Stores the generated account in the local `virtual_accounts` table.
 *
 * @param {object} req - Express request object. Expects user to be authenticated (`req.user.id`) and body to include:
 *   - first_name: string
 *   - last_name: string
 *   - email: string
 *   - phone: string
 *   - amount: number
 *
 * @param {object} res - Express response object.
 * @returns {object} - JSON response with success or error message.
 */
exports.createAccount = async (req, res) => {
  const userId = req.user.id;
  const { first_name, last_name, email, phone, amount } = req.body;

  try {
    // Ensure the user exists in the database
    const user = await knex('users').where({ id: userId }).first();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Call Raven API to create a virtual account
    const response = await axios.post(
      `${process.env.RAVEN_BASE_URL}/pwbt/generate_account`,
      {
        first_name,
        last_name,
        email,
        amount,
        phone
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.RAVEN_API_KEY}`
        }
      }
    );

    // Extract account details from Raven response
    const data = response.data.data;

    // Save virtual account to local DB
    await VirtualAccount.create({
      user_id: userId,
      account_number: data.account_number,
      bank_name: data.bank,
      account_name: data.account_name
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error creating account:', error.message);

    // Optional: show more verbose error in development
    if (process.env.NODE_ENV === 'development') {
      return res.status(500).json({ error: error.message });
    }

    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
