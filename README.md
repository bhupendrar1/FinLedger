# 🏦 Banking Transaction System

<p align="center">
  <strong>A backend ledger-based banking API built with Node.js, Express.js and MongoDB.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-REST%20API-000000?logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Mongoose-ODM-880000?logo=mongoose&logoColor=white" alt="Mongoose" />
  <img src="https://img.shields.io/badge/JWT-Authentication-purple?logo=jsonwebtokens" alt="JWT" />
  <img src="https://img.shields.io/badge/Nodemailer-Email-blue" alt="Nodemailer" />
  <img src="https://img.shields.io/badge/License-ISC-blue" alt="ISC License" />
</p>

---

## 📌 Project Brief

**Banking Transaction System** is a backend-focused banking and ledger management application developed using **Node.js, Express.js and MongoDB**.

The project demonstrates how a banking backend can manage users, accounts, transactions and balances while maintaining transaction records through a **ledger-based accounting model** instead of storing a mutable balance directly on an account.

The system provides REST APIs for:

- User registration and authentication
- JWT-based authorization
- Account creation and account retrieval
- Ledger-derived balance calculation
- Account-to-account money transfers
- Transaction status management
- Idempotency protection against duplicate transfers
- System-user controlled initial funding
- Immutable ledger entries
- Email notifications through Nodemailer and Gmail OAuth2
- MongoDB transaction sessions for transfer processing

The main objective of the project is to build a backend that demonstrates **real-world banking concepts such as authentication, authorization, ledger accounting, transaction consistency, idempotency and auditability**.

---

## 🎯 Problem Statement

A banking system cannot simply increase or decrease a user's balance whenever money moves. A reliable financial system needs to know:

- Who owns an account?
- Where did the money come from?
- Where did the money go?
- Which transaction created a balance change?
- Can the same payment request accidentally be processed twice?
- What happens when an account is frozen or closed?
- Can historical ledger records be modified?
- How can a balance be reconstructed from transaction records?

This project addresses these concerns by separating **accounts, transactions and ledger entries** and calculating account balances from the ledger.

---

## 💡 Core Idea

The system follows this simplified financial model:

```text
                    BANKING TRANSACTION SYSTEM

 User
  │
  ├── Authentication
  │      └── JWT Token
  │
  └── Account
         │
         ├── Account Status
         │
         └── Ledger Entries
                 │
                 ├── CREDIT
                 └── DEBIT

Transaction
  │
  ├── From Account
  ├── To Account
  ├── Amount
  ├── Idempotency Key
  └── Status
         │
         ├── PENDING
         ├── COMPLETED
         ├── FAILED
         └── REVERSED
```

### Balance Formula

The account balance is derived from ledger entries:

```text
             Total CREDIT
Balance = -------------------
             Total DEBIT

Actual formula:
Balance = Total Credits - Total Debits
```

Example:

```text
CREDIT  ₹10,000
CREDIT  ₹5,000
DEBIT   ₹3,000
DEBIT   ₹2,000
----------------
Balance ₹10,000
```

This makes the ledger the source of truth for the account balance.

---

# ✨ Features

## 👤 User Management

- User registration
- User login
- User logout
- Unique email validation
- Password hashing with bcryptjs
- Password comparison during login
- JWT generation
- Authentication through cookies or Bearer token
- Token blacklist after logout

## 🔐 Authentication & Authorization

The application uses JWT for authentication.

```text
Login / Register
       ↓
JWT Generated
       ↓
Cookie + Response Token
       ↓
Protected Request
       ↓
Auth Middleware
       ↓
Token Verification
       ↓
User Loaded
       ↓
Controller
```

The system also has a separate authorization middleware for **system users**.

## 🏦 Account Management

Authenticated users can:

- Create an account
- Retrieve their accounts
- Check the balance of their own account

Account statuses supported by the model:

```text
ACTIVE
FROZEN
CLOSED
```

Only `ACTIVE` accounts can participate in normal transfers.

## 💸 Transactions

The normal transfer API supports:

- Source account
- Destination account
- Amount
- Idempotency key
- Account-status validation
- Insufficient-balance validation
- Transaction status
- Debit ledger entry
- Credit ledger entry
- MongoDB session/transaction
- Email notification

## 🔁 Idempotency

Every transaction requires a unique `idempotencyKey`.

Example:

```json
{
  "idempotencyKey": "transfer-user1-001"
}
```

If the same key has already been processed, the API checks the existing transaction status instead of blindly creating another transaction.

This protects the system from accidental duplicate requests such as:

```text
User clicks Pay
       ↓
Network delay
       ↓
User clicks Pay again
       ↓
Same Idempotency Key
       ↓
Existing transaction detected
```

## 📒 Immutable Ledger

Ledger entries represent financial movements as either:

```text
CREDIT
DEBIT
```

Important ledger fields include:

- Account
- Amount
- Transaction reference
- Entry type

Ledger fields are designed to be immutable, and modification/deletion operations are explicitly blocked by middleware in the ledger model.

## 🏛️ Initial Funds

A system-user protected endpoint can create an initial-funds transaction for an account.

```text
System User
     ↓
System Account
     ↓
DEBIT
     ↓
Destination Account
     ↓
CREDIT
```

## 📧 Email Notifications

Nodemailer is integrated using Gmail OAuth2.

Supported email operations include:

- Registration/welcome email
- Successful transaction email
- Transaction failure email function

---

# 🛠️ Technology Stack

| Technology | Role |
|---|---|
| Node.js | Server-side JavaScript runtime |
| Express.js | REST API framework |
| MongoDB | NoSQL database |
| Mongoose | MongoDB ODM and schema management |
| JSON Web Token | Authentication |
| bcryptjs | Password hashing |
| Nodemailer | Email service |
| cookie-parser | Cookie handling |
| dotenv | Environment configuration |
| Nodemon | Development server reload |

---

# 🏗️ Complete System Architecture

```text
                         ┌────────────────────────┐
                         │        CLIENT          │
                         │ Postman / Web Frontend │
                         └───────────┬────────────┘
                                     │
                                     │ HTTP / JSON
                                     ▼
                         ┌────────────────────────┐
                         │       EXPRESS APP      │
                         │        src/app.js      │
                         └───────────┬────────────┘
                                     │
             ┌───────────────────────┼───────────────────────┐
             │                       │                       │
             ▼                       ▼                       ▼
      ┌─────────────┐         ┌─────────────┐         ┌──────────────┐
      │ Auth Routes │         │Account Routes│        │ Transaction  │
      │ /api/auth   │         │ /api/accounts│        │ Routes       │
      └──────┬──────┘         └──────┬──────┘         └──────┬───────┘
             │                       │                       │
             └───────────────────────┼───────────────────────┘
                                     ▼
                         ┌────────────────────────┐
                         │   AUTH MIDDLEWARE      │
                         │ JWT + Blacklist Check  │
                         └───────────┬────────────┘
                                     ▼
                         ┌────────────────────────┐
                         │      CONTROLLERS       │
                         │ Business Logic Layer   │
                         └───────────┬────────────┘
                                     ▼
                         ┌────────────────────────┐
                         │     MONGOOSE MODELS    │
                         │ User / Account /       │
                         │ Transaction / Ledger   │
                         └───────────┬────────────┘
                                     ▼
                         ┌────────────────────────┐
                         │        MONGODB         │
                         └───────────┬────────────┘
                                     │
                                     ▼
                         ┌────────────────────────┐
                         │      EMAIL SERVICE     │
                         │  Nodemailer / Gmail    │
                         └────────────────────────┘
```

---

# 📂 Complete Project File Structure

```text
Banking-Transaction-System-
│
├── src/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── account.controller.js
│   │   ├── auth.controller.js
│   │   └── transaction.controller.js
│   │
│   ├── middlewares/
│   │   └── auth.middleware.js
│   │
│   ├── models/
│   │   ├── account.model.js
│   │   ├── blacklist.model.js
│   │   ├── ledger.model.js
│   │   ├── transaction.model.js
│   │   └── user.model.js
│   │
│   ├── routes/
│   │   ├── account.routes.js
│   │   ├── auth.routes.js
│   │   └── transaction.routes.js
│   │
│   └── services/
│       └── email.service.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
└── README.md
```

> `node_modules/` is generated by `npm install` and should normally not be committed to Git.

---

# 📖 File-by-File Explanation

## `server.js`

The main application entry point.

Responsibilities:

1. Load environment variables using `dotenv`.
2. Import the Express application.
3. Import the MongoDB connection function.
4. Connect to MongoDB.
5. Start the HTTP server.
6. Listen on port `3000`.

```text
server.js
   │
   ├── dotenv
   ├── database connection
   └── Express app
          ↓
       port 3000
```

---

## `src/app.js`

Creates and configures the Express application.

Responsibilities include:

- Creating the Express application
- Enabling JSON request parsing
- Enabling cookie parsing
- Registering authentication routes
- Registering account routes
- Registering transaction routes
- Providing the root health/status endpoint

Route prefixes:

```text
/api/auth
/api/accounts
/api/transactions
```

---

# ⚙️ Configuration

## `src/config/db.js`

Responsible for connecting the application to MongoDB using the `MONGODB_URI` environment variable.

```text
Application
     ↓
connectToDB()
     ↓
MONGODB_URI
     ↓
MongoDB
```

---

# 👤 Models

## `src/models/user.model.js`

Defines the user schema.

Main fields:

| Field | Type | Purpose |
|---|---|---|
| `email` | String | Unique user email |
| `name` | String | User name |
| `password` | String | Hashed password |
| `systemUser` | Boolean | System-user authorization flag |

Important behavior:

- Email is normalized to lowercase.
- Email has a format check.
- Email is unique.
- Password is excluded from normal queries with `select: false`.
- Password is hashed using bcryptjs before save.
- `comparePassword()` compares a plain password with the stored hash.

---

## `src/models/account.model.js`

Defines the bank account schema.

Main fields:

| Field | Type | Purpose |
|---|---|---|
| `user` | ObjectId | Account owner |
| `status` | Enum | Account state |
| `currency` | String | Account currency |

Supported statuses:

```text
ACTIVE
FROZEN
CLOSED
```

The model provides:

```javascript
account.getBalance()
```

This method aggregates ledger entries and calculates:

```text
Total Credits - Total Debits
```

---

## `src/models/transaction.model.js`

Represents a money-transfer operation.

Main fields:

| Field | Type | Purpose |
|---|---|---|
| `fromAccount` | ObjectId | Sender account |
| `toAccount` | ObjectId | Receiver account |
| `status` | Enum | Transaction state |
| `amount` | Number | Transfer amount |
| `idempotencyKey` | String | Duplicate-request protection |

Transaction states:

```text
PENDING
COMPLETED
FAILED
REVERSED
```

The idempotency key is indexed and unique.

---

## `src/models/ledger.model.js`

Represents individual financial movements.

Fields:

| Field | Purpose |
|---|---|
| `account` | Account affected by the entry |
| `amount` | Amount of the ledger movement |
| `transaction` | Related transaction |
| `type` | `CREDIT` or `DEBIT` |

Ledger entries are intentionally immutable. Update and delete operations are blocked through Mongoose middleware.

This is an important part of the project's accounting design because historical financial records should not be casually changed after creation.

---

## `src/models/blacklist.model.js`

Stores JWT tokens that have been invalidated during logout.

Authentication middleware checks this collection before accepting a token.

```text
Logout
  ↓
Token added to blacklist
  ↓
Cookie cleared
  ↓
Future request
  ↓
Blacklist check
  ↓
401 Unauthorized
```

---

# 🎮 Controllers

## `src/controllers/auth.controller.js`

Contains authentication business logic.

### `userRegisterController`

```text
Request
 ↓
Check existing email
 ↓
Create user
 ↓
Hash password through model hook
 ↓
Generate JWT
 ↓
Set cookie
 ↓
Return user + token
 ↓
Send registration email
```

### `userLoginController`

```text
Email + Password
       ↓
Find user
       ↓
Load password hash
       ↓
Compare password
       ↓
Generate JWT
       ↓
Set cookie
       ↓
Return authenticated user
```

### `userLogoutController`

```text
Get token
   ↓
Store token in blacklist
   ↓
Clear cookie
   ↓
Logout response
```

---

## `src/controllers/account.controller.js`

Contains account-related business logic.

### `createAccountController`

Creates an account for the authenticated user.

### `getUserAccountsController`

Returns accounts belonging to the authenticated user.

### `getAccountBalanceController`

Checks account ownership and calculates the balance from the ledger.

---

## `src/controllers/transaction.controller.js`

Contains the core financial transaction logic.

The normal transaction implementation follows a documented 10-step flow:

```text
1. Validate request
2. Validate idempotency key
3. Check account status
4. Derive sender balance from ledger
5. Create transaction as PENDING
6. Create DEBIT ledger entry
7. Create CREDIT ledger entry
8. Mark transaction COMPLETED
9. Commit MongoDB session
10. Send email notification
```

The transfer uses a MongoDB session so the transaction and ledger writes are grouped into a database transaction.

---

# 🛡️ Middleware

## `src/middlewares/auth.middleware.js`

Contains two authentication/authorization middleware functions.

### `authMiddleware`

Checks:

1. Token exists.
2. Token is not blacklisted.
3. JWT signature is valid.
4. User exists.

Then attaches the authenticated user to:

```javascript
req.user
```

### `authSystemUserMiddleware`

Performs the same authentication checks and additionally verifies that the authenticated user has system-user privileges.

Unauthorized system access returns HTTP `403`.

---

# 🛣️ Routes

## `src/routes/auth.routes.js`

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
```

## `src/routes/account.routes.js`

```text
POST /api/accounts/
GET  /api/accounts/
GET  /api/accounts/balance/:accountId
```

## `src/routes/transaction.routes.js`

```text
POST /api/transactions/
POST /api/transactions/system/initial-funds
```

---

# 📧 Services

## `src/services/email.service.js`

Centralized email functionality using Nodemailer.

Functions:

```javascript
sendRegistrationEmail()
sendTransactionEmail()
sendTransactionFailureEmail()
```

The transporter uses Gmail OAuth2 credentials supplied through environment variables.

---

# 🔌 API Documentation

## Base URL

```text
http://localhost:3000
```

---

## 1️⃣ Health Check

### Request

```http
GET /
```

### Response

```text
Ledger Service is up and running
```

---

# 🔐 Authentication APIs

## Register User

```http
POST /api/auth/register
Content-Type: application/json
```

### Request Body

```json
{
  "name": "Bhupendra Singh",
  "email": "bhupendra@example.com",
  "password": "your-password"
}
```

### Expected Success

```text
HTTP 201 Created
```

The response contains the created user's basic information and a JWT token.

---

## Login User

```http
POST /api/auth/login
Content-Type: application/json
```

### Request Body

```json
{
  "email": "bhupendra@example.com",
  "password": "your-password"
}
```

### Expected Success

```text
HTTP 200 OK
```

---

## Logout User

```http
POST /api/auth/logout
```

The server stores the token in the blacklist and clears the authentication cookie.

---

# 🏦 Account APIs

## Create Account

```http
POST /api/accounts/
Authorization: Bearer <JWT_TOKEN>
```

No request body is required.

### Response

```text
HTTP 201 Created
```

---

## Get User Accounts

```http
GET /api/accounts/
Authorization: Bearer <JWT_TOKEN>
```

Returns accounts belonging to the authenticated user.

---

## Get Account Balance

```http
GET /api/accounts/balance/:accountId
Authorization: Bearer <JWT_TOKEN>
```

Example:

```text
GET /api/accounts/balance/65f123456789abcdef123456
```

### Response Example

```json
{
  "accountId": "65f123456789abcdef123456",
  "balance": 6500
}
```

---

# 💸 Transaction APIs

## Create Transaction

```http
POST /api/transactions/
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Request Body

```json
{
  "fromAccount": "SOURCE_ACCOUNT_ID",
  "toAccount": "DESTINATION_ACCOUNT_ID",
  "amount": 500,
  "idempotencyKey": "transfer-unique-001"
}
```

### Processing

```text
Request
  ↓
Validation
  ↓
Account Lookup
  ↓
Idempotency Check
  ↓
Account Status Check
  ↓
Balance Calculation
  ↓
PENDING Transaction
  ↓
DEBIT Ledger
  ↓
CREDIT Ledger
  ↓
COMPLETED Transaction
  ↓
Commit Session
  ↓
Email Notification
```

---

## Initial Funds Transaction

Only a system user is authorized to use this route.

```http
POST /api/transactions/system/initial-funds
Authorization: Bearer <SYSTEM_USER_JWT_TOKEN>
Content-Type: application/json
```

### Request Body

```json
{
  "toAccount": "DESTINATION_ACCOUNT_ID",
  "amount": 10000,
  "idempotencyKey": "initial-funds-001"
}
```

---

# 🔄 Complete User Journey

```text
                    START
                      │
                      ▼
                Register User
                      │
                      ▼
                  Login User
                      │
                      ▼
                 Receive JWT
                      │
                      ▼
               Create Account
                      │
                      ▼
             System Adds Funds
                      │
                      ▼
                Check Balance
                      │
                      ▼
              Create Transfer
                      │
                      ▼
              Debit Sender
                      │
                      ▼
             Credit Receiver
                      │
                      ▼
           Transaction Completed
                      │
                      ▼
              Email Notification
                      │
                      ▼
                    Logout
```

---

# 🗄️ Database Relationship

```text
┌───────────────┐
│     User      │
└───────┬───────┘
        │ 1
        │
        │ many
        ▼
┌───────────────┐
│    Account    │
└───────┬───────┘
        │
        │ many
        ▼
┌───────────────┐       ┌────────────────┐
│     Ledger    │──────▶│  Transaction   │
└───────────────┘       └───────┬────────┘
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
              fromAccount              toAccount
                    │                       │
                    └───────────┬───────────┘
                                ▼
                             Account
```

### Main Collections

```text
users
accounts
transactions
ledgers
blacklists
```

---

# 🔒 Security Design

The project implements several security-related mechanisms:

### Password Security

Passwords are hashed using:

```text
bcryptjs
```

Plain-text passwords are not intended to be stored.

### JWT Authentication

JWT contains the authenticated user's ID and is signed using `JWT_SECRET`.

### Token Blacklisting

Logout invalidates the token by storing it in the blacklist collection.

### Protected Routes

Account and transaction operations require authentication.

### System Authorization

The initial-funds endpoint requires system-user authorization.

### Environment Variables

Secrets and database credentials are loaded from `.env` rather than hard-coded in source files.

---

# ⚙️ Installation & Setup

## Prerequisites

Install:

- Node.js
- npm
- MongoDB / MongoDB Atlas
- Gmail OAuth2 credentials if email functionality is required
- Postman for API testing (recommended)

## Step 1 — Clone

```bash
git clone https://github.com/bhupendrar1/Banking-Transaction-System-.git
cd Banking-Transaction-System-
```

## Step 2 — Install Dependencies

```bash
npm install
```

## Step 3 — Configure `.env`

Create a `.env` file in the project root:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email_address
CLIENT_ID=your_google_oauth_client_id
CLIENT_SECRET=your_google_oauth_client_secret
REFRESH_TOKEN=your_google_oauth_refresh_token
```

⚠️ **Never commit real secrets to GitHub.**

## Step 4 — Run Development Server

```bash
npm run dev
```

## Step 5 — Run Normal Server

```bash
npm start
```

Server:

```text
http://localhost:3000
```

---

# 📦 Package Scripts

From `package.json`:

```bash
npm run dev
```

Starts the server through Nodemon.

```bash
npm start
```

Starts the server using Node.js.

```bash
npm test
```

Currently configured as a placeholder test script and should be replaced with a real automated test suite.

---

# 🧪 Recommended Postman Testing Order

```text
1. Register
        ↓
2. Login
        ↓
3. Copy JWT if required
        ↓
4. Create Account
        ↓
5. Create/identify destination account
        ↓
6. Authenticate as system user
        ↓
7. Add initial funds
        ↓
8. Check balance
        ↓
9. Perform transfer
        ↓
10. Check balances again
        ↓
11. Logout
```

---

# ❌ Important Validation Scenarios

The API should be tested for cases such as:

- Duplicate registration email
- Invalid email format
- Password shorter than the configured minimum
- Invalid login credentials
- Missing JWT token
- Invalid JWT token
- Blacklisted JWT token
- Non-system user attempting system endpoint
- Invalid source account
- Invalid destination account
- Frozen account
- Closed account
- Insufficient balance
- Duplicate idempotency key
- Missing transaction fields
- Negative transaction amount

---

# 🧠 Important Backend Concepts Demonstrated

This project is useful as a backend learning and portfolio project because it demonstrates:

### 1. REST API Design

Separate routes and controllers are used for authentication, accounts and transactions.

### 2. MVC-style Organization

```text
Routes
  ↓
Controllers
  ↓
Models
  ↓
MongoDB
```

### 3. Authentication

JWT-based authentication with cookie and Bearer-token support.

### 4. Authorization

System-user-specific access control.

### 5. Database Relationships

MongoDB ObjectId references connect users, accounts, transactions and ledger entries.

### 6. Aggregation

Account balance is calculated through MongoDB aggregation over ledger records.

### 7. Database Transactions

Transaction processing uses a MongoDB session and transaction.

### 8. Idempotency

Unique idempotency keys help prevent duplicate transaction processing.

### 9. Immutable Financial Records

Ledger entries are protected from modification/deletion.

### 10. External Service Integration

Nodemailer integrates email notification functionality.

---

# 📈 Future Scope

The current backend can be extended into a complete banking platform.

### Backend

- [ ] Transaction history API
- [ ] Transaction filtering by date/status/account
- [ ] Pagination
- [ ] Beneficiary management
- [ ] Account statements
- [ ] Scheduled transfers
- [ ] Transaction reversal workflow
- [ ] Stronger request validation
- [ ] Rate limiting
- [ ] Security headers
- [ ] Structured logging
- [ ] API versioning
- [ ] Swagger/OpenAPI documentation
- [ ] Automated unit and integration tests

### Frontend

A React-based banking dashboard could provide:

```text
Login
  ↓
Dashboard
  ├── Account Balance
  ├── Accounts
  ├── Send Money
  ├── Receive Money
  ├── Transaction History
  ├── Profile
  └── Logout
```

### DevOps

- [ ] Docker
- [ ] CI/CD with GitHub Actions
- [ ] Cloud deployment
- [ ] Monitoring
- [ ] Centralized logs
- [ ] Production secret management

---

# ⚠️ Development Notes

The project is a backend/educational banking simulation and should **not** be treated as production banking infrastructure without additional security, compliance, auditing, testing, concurrency controls, operational monitoring and financial-domain review.

For production use, additional controls would be required around secure cookies, request validation, authorization boundaries, rate limiting, audit logging, concurrency/race-condition handling, secret management, observability, backups and regulatory requirements.

---

# 🤝 Contribution

Contributions are welcome.

```bash
git checkout -b feature/your-feature
```

Make your changes, test them, commit them, and open a pull request.

Example:

```bash
git add .
git commit -m "feat: add transaction history"
git push origin feature/your-feature
```

---

# 👨‍💻 Author

**Bhupendra Singh**

B.Tech CSE | Backend / Full-Stack Developer

GitHub: **@bhupendrar1**

Repository: **Banking-Transaction-System-**

---

# 📄 License

This project is licensed under the **ISC License**.

---

<p align="center">
  <strong>🏦 Banking Transaction System</strong><br />
  Built with Node.js • Express.js • MongoDB • Mongoose • JWT
</p>
