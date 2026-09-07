# 🏦 Banking Transaction System

<p align="center">
  <strong>A secure REST API for users, bank accounts, ledger-based balances, and transactions.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-Backend-green?logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-REST%20API-black?logo=express" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Mongoose-ODM-red?logo=mongoose" alt="Mongoose" />
  <img src="https://img.shields.io/badge/JWT-Authentication-purple?logo=jsonwebtokens" alt="JWT" />
  <img src="https://img.shields.io/badge/License-ISC-blue" alt="ISC License" />
</p>

## 📌 Overview

**Banking Transaction System** is a Node.js and Express.js backend that models core banking operations through REST APIs. It provides user authentication, account management, ledger-derived balances, authenticated money transfers, idempotency handling, transaction states, and email notifications.

The application uses **MongoDB + Mongoose** for persistence and **JWT-based authentication** with support for HTTP cookies and the `Authorization` header.

## ✨ Key Features

- 🔐 User registration and login
- 🔑 JWT authentication with 3-day token expiry
- 🍪 Authentication through cookies or `Authorization: Bearer <token>`
- 🚪 Logout with token blacklisting
- 🏦 Create and retrieve user accounts
- 💰 Calculate account balance from ledger entries
- 💸 Authenticated account-to-account transactions
- 🧾 Double-entry-style debit and credit ledger records
- 🔁 Idempotency-key handling to prevent duplicate transaction processing
- 📊 Transaction lifecycle: `PENDING` → `COMPLETED`
- 🛑 Account status checks for `ACTIVE`, `FROZEN`, and `CLOSED` accounts
- 💳 Insufficient-balance validation
- 🏛️ System-user protected initial-funds transaction endpoint
- 📧 Registration and transaction email notifications with Nodemailer
- 🗄️ MongoDB persistence with Mongoose schemas and indexes
- ⚙️ Environment-variable based configuration

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express.js** | REST API framework |
| **MongoDB** | Database |
| **Mongoose** | MongoDB ODM |
| **JWT** | Authentication and authorization |
| **bcryptjs** | Password hashing and comparison |
| **Nodemailer** | Email notifications |
| **cookie-parser** | Cookie parsing |
| **dotenv** | Environment variable management |

## 🏗️ Architecture

```text
                         ┌─────────────────────┐
                         │       Client        │
                         │ Postman / Frontend  │
                         └──────────┬──────────┘
                                    │ HTTP/JSON
                                    ▼
                         ┌─────────────────────┐
                         │    Express.js API   │
                         └──────────┬──────────┘
                                    │
             ┌──────────────────────┼──────────────────────┐
             ▼                      ▼                      ▼
      ┌──────────────┐       ┌──────────────┐       ┌──────────────┐
      │     Auth     │       │   Accounts   │       │ Transactions │
      │    Routes    │       │    Routes    │       │    Routes    │
      └──────┬───────┘       └──────┬───────┘       └──────┬───────┘
             │                      │                      │
             └──────────────────────┼──────────────────────┘
                                    ▼
                         ┌─────────────────────┐
                         │  Auth Middleware    │
                         │ JWT + Blacklist     │
                         └──────────┬──────────┘
                                    ▼
                         ┌─────────────────────┐
                         │    Controllers      │
                         └──────────┬──────────┘
                                    ▼
                         ┌─────────────────────┐
                         │ Mongoose Models     │
                         │ User / Account /    │
                         │ Transaction /       │
                         │ Ledger              │
                         └──────────┬──────────┘
                                    ▼
                         ┌─────────────────────┐
                         │      MongoDB        │
                         └─────────────────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    Nodemailer       │
                         │ Email Notifications │
                         └─────────────────────┘
```

## 📁 Project Structure

```text
Banking-Transaction-System-
│
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── account.controller.js
│   │   ├── auth.controller.js
│   │   └── transaction.controller.js
│   ├── middlewares/
│   │   └── auth.middleware.js
│   ├── models/
│   │   ├── account.model.js
│   │   ├── blacklist.model.js
│   │   ├── ledger.model.js
│   │   ├── transaction.model.js
│   │   └── user.model.js
│   ├── routes/
│   │   ├── account.routes.js
│   │   ├── auth.routes.js
│   │   └── transaction.routes.js
│   └── services/
│       └── email.service.js
│
├── .env
├── package.json
├── server.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites

Make sure you have:

- Node.js installed
- npm installed
- A MongoDB database, such as MongoDB Atlas
- Gmail OAuth2 credentials if you want email notifications

### 1. Clone the repository

```bash
git clone https://github.com/bhupendrar1/Banking-Transaction-System-.git
cd Banking-Transaction-System-
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email_address
CLIENT_ID=your_google_oauth_client_id
CLIENT_SECRET=your_google_oauth_client_secret
REFRESH_TOKEN=your_google_oauth_refresh_token
```

> ⚠️ **Never commit `.env` or real credentials to GitHub.** Use secret management or environment variables in production.

### 4. Run the server

Development mode:

```bash
npm run dev
```

Production/start mode:

```bash
npm start
```

The API runs on:

```text
http://localhost:3000
```

Health check:

```text
GET http://localhost:3000/
```

Expected response:

```text
Ledger Service is up and running
```

## 🔌 API Documentation

Base URL:

```text
http://localhost:3000
```

### 🔐 Authentication APIs

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Login and receive JWT | ❌ |
| `POST` | `/api/auth/logout` | Logout and blacklist token | Optional token |

#### Register

```http
POST /api/auth/register
Content-Type: application/json
```

```json
{
  "name": "Bhupendra Singh",
  "email": "bhupendra@example.com",
  "password": "your-password"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "bhupendra@example.com",
  "password": "your-password"
}
```

The successful login response contains the authenticated user and JWT token. The server also sets an authentication cookie.

### 🏦 Account APIs

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/accounts/` | Create an account for the logged-in user | 🔒 Required |
| `GET` | `/api/accounts/` | Get accounts belonging to the logged-in user | 🔒 Required |
| `GET` | `/api/accounts/balance/:accountId` | Calculate account balance | 🔒 Required |

Example:

```http
POST /api/accounts/
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

No request body is required for account creation.

### 💸 Transaction APIs

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/transactions/` | Transfer funds between accounts | 🔒 Required |
| `POST` | `/api/transactions/system/initial-funds` | Add initial funds through system account | 🔐 System user |

#### Create Transaction

```http
POST /api/transactions/
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

```json
{
  "fromAccount": "SOURCE_ACCOUNT_ID",
  "toAccount": "DESTINATION_ACCOUNT_ID",
  "amount": 500,
  "idempotencyKey": "unique-transfer-001"
}
```

A successful transfer creates a transaction and corresponding `DEBIT` and `CREDIT` ledger entries before marking the transaction `COMPLETED`.

#### Initial Funds

```http
POST /api/transactions/system/initial-funds
Authorization: Bearer <SYSTEM_USER_JWT_TOKEN>
Content-Type: application/json
```

```json
{
  "toAccount": "DESTINATION_ACCOUNT_ID",
  "amount": 10000,
  "idempotencyKey": "initial-funds-001"
}
```

## 🔄 Transaction Processing Flow

The normal transfer flow is designed around a ledger and MongoDB transaction session:

```text
1. Validate request
       ↓
2. Validate idempotency key
       ↓
3. Check both account statuses
       ↓
4. Calculate sender balance from ledger
       ↓
5. Create transaction as PENDING
       ↓
6. Create DEBIT ledger entry
       ↓
7. Create CREDIT ledger entry
       ↓
8. Mark transaction COMPLETED
       ↓
9. Commit MongoDB session
       ↓
10. Send transaction email notification
```

### Transaction States

```text
PENDING ───────► COMPLETED
   │
   ├───────────► FAILED
   │
   └───────────► REVERSED
```

The API also checks the idempotency key so that a previously processed request can be identified instead of being processed again.

## 💰 Ledger-Based Balance

Account balances are derived from ledger entries rather than stored as a single mutable balance value.

Conceptually:

```text
Balance = Total Credits - Total Debits
```

Example:

```text
Credits:  ₹10,000
Debits:   ₹3,500
------------------
Balance:  ₹6,500
```

This approach provides a clear transaction history foundation and makes balance calculation traceable through ledger records.

## 🔐 Authentication & Security

- Passwords are hashed using `bcryptjs` before persistence.
- JWT tokens are signed using `JWT_SECRET` and expire after 3 days.
- Authentication accepts a cookie token or Bearer token.
- Logged-out tokens are stored in a blacklist and rejected by authentication middleware.
- Protected account and transaction routes require authentication.
- System-user routes perform an additional authorization check.
- Account ownership is checked when retrieving an account balance.
- Sensitive credentials are loaded from environment variables.
- `.env` and OAuth credentials should never be committed to source control.

## 📧 Email Notifications

The project integrates **Nodemailer with Gmail OAuth2** for:

- Registration/welcome emails
- Successful transaction notifications
- Transaction failure email support

Required email environment variables are:

```env
EMAIL_USER=...
CLIENT_ID=...
CLIENT_SECRET=...
REFRESH_TOKEN=...
```

## 🧪 Available Scripts

```bash
npm run dev    # Start development server using Nodemon
npm start      # Start server using Node.js
npm test       # Current test-script placeholder
```

## 🧰 Testing APIs with Postman

A simple testing sequence is:

```text
Register User
     ↓
Login User
     ↓
Create Account
     ↓
Create/Use Destination Account
     ↓
Add Initial Funds (System User)
     ↓
Check Balance
     ↓
Create Transfer
     ↓
Check Updated Balance
     ↓
Logout
```

For protected APIs, send the JWT as either:

```http
Authorization: Bearer <JWT_TOKEN>
```

or use the authentication cookie returned by the server.

## 🚧 Known Improvements / Roadmap

- [ ] Add comprehensive automated tests with Jest and Supertest
- [ ] Add request validation and stronger input sanitization
- [ ] Add transaction history and filtering endpoints
- [ ] Add pagination for accounts and transactions
- [ ] Improve transaction failure/recovery and rollback handling
- [ ] Add Swagger/OpenAPI documentation
- [ ] Add rate limiting and security headers
- [ ] Add structured logging and monitoring
- [ ] Add Docker support
- [ ] Add GitHub Actions CI/CD
- [ ] Deploy the API to a cloud platform
- [ ] Add a frontend banking dashboard

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test the changes locally.
5. Commit and push your branch.
6. Open a pull request.

## 👨‍💻 Author

**Bhupendra Singh**

- GitHub: https://github.com/bhupendrar1
- Project: https://github.com/bhupendrar1/Banking-Transaction-System-

## 📄 License

This project is licensed under the **ISC License** as specified in `package.json`.

---

<p align="center">
  ⭐ If you found this project useful, consider giving it a star!
</p>
