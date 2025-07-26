const axios = require('axios')
const knex = require('../../knex')

const VirtualAccount = require('../models/virtualaccount.model')
require('dotenv').config()

exports.createAccount = async (req, res) => {
  const userId = req.user.id
  const { first_name, last_name, email, phone, amount } = req.body

  try {
    // Get user from DB if fallback needed
    const user = await knex('users').where({ id: userId }).first()

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const response = await axios.post(
      `${process.env.RAVEN_BASE_URL}/pwbt/generate_account`,
      {
        first_name: first_name,
        last_name: last_name,
        email: email,
        amount: amount,
        phone: phone
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.RAVEN_API_KEY}`
        }
      }
    )
    data = response.data.data;
    // Save virtual account details to DB
    await VirtualAccount.create({
      user_id: userId,
      account_number: data.account_number,
      bank_name: data.bank,
      account_name: data.account_name
    })

    return res.status(200).json(response.data)
  } catch (error) {
    console.error('Error creating account:', error.message)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
