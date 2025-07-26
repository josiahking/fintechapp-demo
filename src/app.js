const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const accountRoutes = require('./routes/account.routes');
const webhookRoutes = require('./routes/webhook.routes');

const app = express();

/**
 * Middleware Setup
 */

// Enable CORS for all origins (you can restrict this in production)
app.use(cors());

// Parse incoming JSON payloads
app.use(express.json());

// Log HTTP requests in dev format
app.use(morgan('dev'));

/**
 * Health Check Endpoint
 * @route GET /
 * @returns {Object} 200 - API is running message
 */
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Fintech API is running' });
});

/**
 * Route Definitions
 */
app.use('/api/auth', authRoutes);       // Auth (signup/login)
app.use('/api/accounts', accountRoutes); // Virtual account routes
app.use('/webhook', webhookRoutes);      // Webhook handler

/**
 * Global Error Handler
 * Captures all unhandled errors from routes/middleware
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Something went wrong',
  });
});

module.exports = app;
