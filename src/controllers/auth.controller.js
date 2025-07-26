const authModel = require('../models/auth.model');
const hash = require('../utils/hash');
const jwt = require('../utils/jwt');
const { v4: uuidv4 } = require('uuid');

/**
 * Signup controller to register a new user.
 *
 * Steps:
 * 1. Validate if email is already used.
 * 2. Hash the password.
 * 3. Create a new user with a UUID.
 * 4. Generate JWT token and respond with it.
 */
exports.signup = async (req, res) => {
  const { full_name, email, password } = req.body;

  try {
    // Check if user with the same email exists
    const exists = await authModel.getUserByEmail(email);
    if (exists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash password before storing
    const password_hash = await hash.hashPassword(password);

    // Create user object
    const user = {
      id: uuidv4(),
      full_name,
      email,
      password_hash
    };

    // Save user in DB
    await authModel.createUser(user);

    // Generate token
    const token = jwt.generateToken({ id: user.id });

    return res.status(201).json({ token });
  } catch (err) {
    console.error('Signup error:', err.message);
    return res.status(500).json({ message: 'Signup error', error: err.message });
  }
};

/**
 * Login controller to authenticate user.
 *
 * Steps:
 * 1. Find user by email.
 * 2. Verify password with hash.
 * 3. If valid, generate and return JWT token.
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Look up user by email
    const user = await authModel.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password hashes
    const match = await hash.comparePassword(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.generateToken({ id: user.id });

    return res.status(200).json({ token });
  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ message: 'Login error', error: err.message });
  }
};
