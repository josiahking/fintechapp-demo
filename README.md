
# 🧾 Fintech App - Raven Integration – Node.js + Knex.js

This project implements and tests a webhook handler for Raven bank transfer notifications. It includes a secure Express endpoint, controller logic, database interactions using Knex.js, and a comprehensive test suite using Jest.

---

## API Documentation

The full Postman documentation can be found here:  
👉 [View API Docs](https://documenter.getpostman.com/view/47073466/2sB34oCxoK)

---

## 📁 Project Structure

```
.
├── src/
│   ├── app.js                          # Express app
│   ├── controllers/
│   │   └── transferwebhook.controller.js  # Core webhook logic
│   └── models/
│       └── transferwebhook.model.js      # DB operations with Knex
│
├── test/
│   ├── webhook-handler.test.js        # Controller unit tests
│   ├── webhook-route.test.js          # Endpoint integration tests
│   └── setup.js                       # Test user creation and JWT
│
├── knex.js                            # Initialized Knex instance
├── .env                               # Secrets and configs
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. Clone & Install

```bash
git clone https://github.com/josiahking/fintechapp-demo.git
cd fintechapp-demo
npm install
```

### 2. Configure Environment

Create a `.env` file with:

```env
PORT=3000
DATABASE_URL=mysql://user:pass@localhost:3306/dbname
JWT_SECRET=testsecret
RAVEN_WEBHOOK_SECRET=your_webhook_secret
```

### 3. Run Migrations

```bash
npx knex migrate:latest
```

---

## 🚀 Start App

```bash
npm run dev
```

---

## ✅ Run Tests

Tests are powered by **Jest** and include:

- Controller logic tests
- Express route integration tests
- Secure webhook validation
- Database inserts verification

Run all tests with:

```bash
npm test
```

---

## 🔐 Webhook Security

Raven sends a `secret` field with webhook payloads. Your server compares this to `RAVEN_WEBHOOK_SECRET` in `.env` for validation.

- Requests without a valid `secret` are rejected with **401 Unauthorized**.
- Webhook payloads are logged in `webhook_events` table for traceability.

---

## 📤 Sample Payload (Raven Webhook)

```json
{
  "merchant_ref": "202209082013GAEGBCB",
  "meta": {
    "account_number": "1234567890"
  },
  "trx_ref": "test-ref-123",
  "status": "successful",
  "session_id": "some-session-id",
  "type": "transfer",
  "secret": "your_webhook_secret"
}
```

---

## 📌 Key Features

- 📦 Modular MVC structure
- 🔒 Webhook verification
- 🛠️ Knex.js for DB abstraction
- 🧪 Full test suite (Jest + Supertest)
- 🧰 Utility for test user creation and auth mocking

---

## 🙋‍♂️ Author

Built with ❤️ by Josiah Gerald

---

## 📜 License

[GNU](https://github.com/josiahking/fintechapp-demo/blob/main/LICENSE)
