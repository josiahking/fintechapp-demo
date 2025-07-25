const authModel = require('../models/auth.model');
const hash = require('../utils/hash');
const jwt = require('../utils/jwt');
const { v4: uuidv4 } = require('uuid');

exports.signup = async (req, res) => {
  const { full_name, email, password } = req.body;

  try {
    const exists = await authModel.getUserByEmail(email);
    if (exists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const password_hash = await hash.hashPassword(password);
    const user = {
      id: uuidv4(),
      full_name,
      email,
      password_hash
    };

    await authModel.createUser(user);
    const token = jwt.generateToken({ id: user.id });

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Signup error', error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await authModel.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const match = await hash.comparePassword(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.generateToken({ id: user.id });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
};
