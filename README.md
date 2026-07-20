# Fintech App Demo — Raven Integration

A backend fintech integration demo built with Node.js, Express, MySQL, Knex.js, JWT authentication, and Raven Bank APIs.

The application demonstrates user authentication, virtual-account creation, webhook validation, collection processing, transfer-status updates, balance updates, database migrations, and automated API testing.

> **Portfolio notice:** This project was created as a technical assessment and demonstration. It is not production-ready financial software and should not be used to hold, move, or reconcile real funds without substantial security, compliance, accounting, and operational improvements.

## Features

### Authentication

- User registration
- User login
- Password hashing with bcrypt
- JWT-based authentication
- Protected account-creation endpoint

### Virtual Accounts

- Creates virtual accounts through the Raven API
- Validates account-creation input with Joi
- Stores generated account details in MySQL
- Associates each virtual account with an authenticated user

### Webhook Processing

- Accepts Raven collection and transfer webhook events
- Validates incoming webhook secrets
- Routes events by webhook type
- Rejects malformed or unauthorised events
- Stores webhook events for traceability
- Prevents duplicate collection transactions using external references
- Records collection metadata
- Updates user balances for successful collection events
- Updates transfer transaction status and session identifiers

### Engineering Quality

- Structured Express routes, controllers, models, middleware, and utilities
- Database migrations with Knex.js
- Separate development and test database settings
- Input validation with Joi
- Request logging with Morgan
- Unit and integration tests with Jest and Supertest

## Technology Stack

- Node.js
- Express 5
- MySQL
- Knex.js
- JWT
- bcrypt
- Joi
- Axios
- Morgan
- CORS
- Jest
- Supertest
- Nodemon

## Architecture

```text
fintechapp-demo/
├── migrations/                     # Knex database migrations
├── src/
│   ├── controllers/
│   │   ├── accountController.js
│   │   ├── auth.controller.js
│   │   ├── collectionwebhook.controller.js
│   │   ├── transferwebhook.controller.js
│   │   └── webhook.controller.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── validateAccountInput.js
│   │   └── validateWebhook.js
│   ├── models/
│   │   ├── auth.model.js
│   │   ├── collectionwebhook.model.js
│   │   ├── transferwebhook.model.js
│   │   ├── virtualaccount.model.js
│   │   └── webhook.model.js
│   ├── routes/
│   │   ├── account.routes.js
│   │   ├── auth.routes.js
│   │   └── webhook.routes.js
│   ├── utils/
│   │   └── handleBalanceUpdate.js
│   └── app.js
├── tests/
│   ├── account.test.js
│   ├── auth.test.js
│   ├── collectionWebhook.test.js
│   ├── db.test.js
│   ├── handleBalanceUpdate.test.js
│   ├── setup.js
│   └── transferWebhook.test.js
├── .env-sample
├── index.js
├── jest.config.js
├── knex.js
├── knexfile.js
├── package.json
└── README.md
```

The codebase separates HTTP routing, request validation, business logic, database access, and reusable balance-update behaviour.

## API Overview

### Health Check

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/` | Public | Confirm that the API is running |

### Authentication

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Authenticate a user and return a JWT |

### Virtual Accounts

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `POST` | `/api/accounts/create` | JWT required | Generate and store a Raven virtual account |

### Webhooks

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `POST` | `/webhook` | Webhook secret required | Process Raven collection or transfer events |

## Authentication Examples

### Register a user

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "08012345678",
    "password": "securePassword"
  }'
```

### Log in

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword"
  }'
```

The login response includes a JWT. Send it with protected requests:

```http
Authorization: Bearer <token>
```

## Create a Virtual Account

```bash
curl -X POST http://localhost:3000/api/accounts/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "08012345678",
    "amount": 1000
  }'
```

The application:

1. Verifies the JWT.
2. Validates the request body.
3. Confirms that the authenticated user exists.
4. Calls Raven's virtual-account endpoint.
5. Stores the returned account number, bank name, and account name locally.

## Webhook Processing

Incoming webhook requests are validated using `RAVEN_WEBHOOK_SECRET`.

### Collection event example

```json
{
  "secret": "your_webhook_secret",
  "type": "collection",
  "session_id": "collection-session-001",
  "account_number": "1234567890",
  "amount": 5000,
  "source": {
    "narration": "Transfer from external bank"
  }
}
```

For a valid collection event, the application:

1. Finds the matching virtual account.
2. Checks whether the transaction reference already exists.
3. Creates a credit transaction when the event is new.
4. Stores collection metadata.
5. Updates the user's balance.

### Transfer event example

```json
{
  "secret": "your_webhook_secret",
  "type": "transfer",
  "merchant_ref": "merchant-reference-001",
  "trx_ref": "transfer-reference-001",
  "status": "successful",
  "session_id": "transfer-session-001",
  "meta": {
    "account_number": "1234567890"
  }
}
```

For a transfer event, the application finds the existing transaction using `trx_ref` and updates its status and session ID.

## Database Schema

Knex migrations create and update tables for:

- Users
- Virtual accounts
- Transactions
- Webhook events
- Collections
- Transfers

The project supports separate development and test database configurations.

## Prerequisites

Install:

- Node.js
- npm
- MySQL
- Git
- Raven API credentials for live integration testing

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/josiahking/fintechapp-demo.git
cd fintechapp-demo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the environment

Copy the sample file:

```bash
cp .env-sample .env
```

Update `.env`:

```dotenv
PORT=3000

MYSQL_HOST=127.0.0.1
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DB=fintech

MYSQL_TEST_HOST=127.0.0.1
MYSQL_TEST_USER=root
MYSQL_TEST_PASSWORD=your_password
MYSQL_TEST_DB=fintech_test

JWT_SECRET=replace_with_a_strong_random_secret

RAVEN_API_KEY=your_raven_api_key
RAVEN_BASE_URL=https://api.getravenbank.com
RAVEN_WEBHOOK_SECRET=your_webhook_secret
```

Create both configured MySQL databases before running migrations or tests.

### 4. Run migrations

Development database:

```bash
npx knex migrate:latest
```

Test database:

```bash
NODE_ENV=test npx knex migrate:latest
```

### 5. Start the application

```bash
npm run dev
```

The default URL is:

```text
http://localhost:3000
```

## Testing

Run the complete Jest test suite:

```bash
npm test
```

The test suite covers:

- Authentication
- Virtual-account creation
- Database connectivity
- Collection webhooks
- Transfer webhooks
- Duplicate-event handling
- Balance-update behaviour
- HTTP endpoint integration

## API Documentation

A Postman collection is available through the repository's existing API documentation link:

[View the Postman API documentation](https://documenter.getpostman.com/view/47073466/2sB34oCxoK)

## Security and Production Considerations

Before adapting the project for production financial use, add and independently review:

- Cryptographic webhook signatures instead of a secret inside the JSON payload
- Raw-body signature verification and replay protection
- Idempotency keys and unique database constraints
- Atomic database transactions
- Row locking for balance changes
- Double-entry ledger accounting
- Integer minor-unit monetary storage
- Rate limiting
- Strong CORS restrictions
- Secure HTTP headers
- Refresh-token and token-revocation strategy
- Multi-factor authentication
- Audit trails
- Centralised logging and monitoring
- Retry and dead-letter handling for webhook processing
- Secret management
- Reconciliation and settlement processes
- Fraud controls
- KYC and AML controls
- Regulatory and privacy compliance
- Independent penetration testing

## Project Status

This repository is a portfolio and technical-assessment project demonstrating:

- Node.js API engineering
- Third-party fintech integration
- JWT authentication
- Virtual-account workflows
- Webhook processing
- Database migrations
- Idempotent collection handling
- Automated backend testing

It should not be considered production-ready financial infrastructure.

## Roadmap

Potential improvements include:

- Webhook signature verification
- Database transactions for all financial mutations
- Double-entry ledger support
- OpenAPI documentation
- Improved error classes and response formats
- Request correlation IDs
- Structured logging
- Rate limiting
- Queue-based webhook processing
- Continuous integration
- Docker development environment
- Expanded integration tests
- Deployment documentation

## Author

**Josiah Gerald**

Senior Backend Engineer specialising in PHP, Laravel, REST APIs, payment integrations, WordPress, and production business platforms.

- GitHub: [github.com/josiahking](https://github.com/josiahking)
- LinkedIn: [linkedin.com/in/josiah-g-0919763b](https://www.linkedin.com/in/josiah-g-0919763b/)

## License

This repository includes the GNU General Public License v3.0.
