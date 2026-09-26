# 🏦 FinLedger — Secure Financial Transaction Platform

<p align="center"><strong>A backend-focused financial transaction and ledger management API built with Node.js, Express.js and MongoDB.</strong></p>

<p align="center">
<img src="https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js&logoColor=white" alt="Node.js" />
<img src="https://img.shields.io/badge/Express.js-REST%20API-000000?logo=express&logoColor=white" alt="Express.js" />
<img src="https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />
<img src="https://img.shields.io/badge/Mongoose-ODM-880000?logo=mongoose&logoColor=white" alt="Mongoose" />
<img src="https://img.shields.io/badge/JWT-Authentication-purple?logo=jsonwebtokens" alt="JWT" />
</p>

## 📌 Overview

**FinLedger** is a backend financial transaction platform that demonstrates how a banking-style system can manage users, accounts, money transfers, transactions and ledger entries.

Instead of treating an account balance as the primary source of truth, FinLedger derives balances from **CREDIT** and **DEBIT** ledger entries. The project also demonstrates JWT authentication, authorization, idempotent transactions, MongoDB transactions and email notifications.

### Core Features

- User registration, login and logout
- JWT-based authentication and protected routes
- Cookie and Bearer-token authentication support
- Password hashing with `bcryptjs`
- Account creation and account retrieval
- Ledger-derived account balances
- Account-to-account money transfers
- Idempotency protection against duplicate transfers
- MongoDB sessions/transactions for atomic processing
- Immutable ledger entries
- Account status management: `ACTIVE`, `FROZEN`, `CLOSED`
- System-user controlled initial funding
- Transaction status management
- Email notifications using Nodemailer and Gmail OAuth2

---

## 🎯 Problem Statement

A reliable financial backend should maintain a traceable history of money movement rather than simply changing an account balance. The system should be able to identify the account owner, transaction source and destination, prevent duplicate requests, validate account status, and reconstruct balances from transaction records.

FinLedger addresses these requirements by separating **users, accounts, transactions and ledger entries** and using the ledger as the source of truth.

---

## 💡 Core Financial Model

```text
                         FINLEDGER

 User
  │
  ├── Authentication ──→ JWT Token
  │
  └── Account
          │
          ├── Status
          │
          └── Ledger Entries
                  ├── CREDIT
                  └── DEBIT

 Transaction
  ├── From Account
  ├── To Account
  ├── Amount
  ├── Idempotency Key
  └── Status
```

### Balance Formula

```text
Balance = Total Credits - Total Debits
```

Example:

```text
CREDIT   ₹10,000
CREDIT   ₹5,000
DEBIT    ₹3,000
DEBIT    ₹2,000
------------------
Balance  ₹10,000
```

The ledger therefore acts as the source of truth for the account balance.

---

## 🔐 Authentication Flow

```text
Register / Login
       ↓
JWT Generated
       ↓
Cookie / Authorization Header
       ↓
Protected Request
       ↓
Auth Middleware
       ↓
Token Verification
       ↓
Authenticated User
       ↓
Controller
```

JWT tokens can also be blacklisted during logout so invalidated tokens cannot continue to access protected resources.

---

## 💸 Transaction & Idempotency Flow

A transfer validates authentication, account ownership/status, idempotency and available balance before creating the financial records.

```text
Transfer Request
      ↓
Validate Idempotency Key
      ↓
Validate Accounts & Status
      ↓
Calculate Balance from Ledger
      ↓
Create Transaction: PENDING
      ↓
Create DEBIT Ledger Entry
      ↓
Create CREDIT Ledger Entry
      ↓
Mark Transaction: COMPLETED
      ↓
Commit MongoDB Transaction
      ↓
Send Email Notification
```

Every transfer uses a unique `idempotencyKey`:

```json
{
  "idempotencyKey": "transfer-user1-001"
}
```

Submitting the same key again allows the existing transaction to be detected instead of blindly creating another transfer.

---

## 📒 Immutable Ledger

Financial movements are stored as:

- `CREDIT`
- `DEBIT`

Ledger entries maintain the affected account, amount, transaction reference and entry type. Update/delete operations are restricted to preserve historical transaction records.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Server-side JavaScript runtime |
| Express.js | REST API framework |
| MongoDB | NoSQL database |
| Mongoose | MongoDB ODM and schema management |
| JSON Web Token | Authentication & authorization |
| bcryptjs | Password hashing |
| Nodemailer | Email notifications |
| cookie-parser | Cookie handling |
| dotenv | Environment configuration |
| Nodemon | Development server reload |

---

## 🏗️ Architecture

```text
Client / Postman
       │
       ▼
Express App
       │
       ├── Auth Routes
       ├── Account Routes
       └── Transaction Routes
              │
              ▼
       Auth Middleware
              │
              ▼
         Controllers
              │
              ▼
         Mongoose Models
              │
              ▼
           MongoDB
              │
              ▼
      Email Service
```

---

## 📂 Project Structure

```text
FinLedger/
│
├── src/
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

### Main Components

- `server.js` — loads configuration, connects to MongoDB and starts the server.
- `src/app.js` — configures Express, middleware and routes.
- `src/config/db.js` — MongoDB connection.
- `auth.controller.js` — registration, login and logout logic.
- `account.controller.js` — account creation, retrieval and balance operations.
- `transaction.controller.js` — transfer workflow and transaction processing.
- `auth.middleware.js` — JWT validation and protected-route authentication.
- `user.model.js` — user schema and password handling.
- `account.model.js` — account ownership, status and balance calculation.
- `transaction.model.js` — transfer records and idempotency key.
- `ledger.model.js` — immutable CREDIT/DEBIT financial entries.
- `blacklist.model.js` — invalidated JWT tokens.
- `email.service.js` — transactional email delivery.

---

## 🌐 API Route Groups

| Route | Purpose |
|---|---|
| `/api/auth` | Registration, login and logout |
| `/api/accounts` | Account management and balance operations |
| `/api/transactions` | Transfers and transaction operations |

> Check the route files in `src/routes/` for the exact HTTP methods, endpoints and request bodies implemented in the project.

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/bhupendrar1/FinLedger.git
cd FinLedger
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root. Use the exact variable names expected by your implementation. Typical configuration includes:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GMAIL_CLIENT_ID=your_client_id
GMAIL_CLIENT_SECRET=your_client_secret
GMAIL_REFRESH_TOKEN=your_refresh_token
GMAIL_USER=your_gmail_address
```

### 4. Run in development

```bash
npm run dev
```

### 5. Run in production

```bash
npm start
```

The server runs on the configured port, for example:

```text
http://localhost:3000
```

---

## 🧪 API Testing

Recommended testing tools:

- Postman
- Thunder Client
- Frontend HTTP clients

Suggested flow:

```text
Register → Login → Create Account → Fund Account
                         ↓
                   Check Balance
                         ↓
                  Transfer Funds
                         ↓
             Verify Ledger Entries
                         ↓
             Test Same Idempotency Key
                         ↓
                       Logout
```

---

## 🔒 Security Practices

FinLedger demonstrates:

- Password hashing with `bcryptjs`
- JWT authentication
- Protected API routes
- Cookie-based authentication
- JWT blacklist handling
- Account ownership validation
- Account status validation
- Idempotency keys
- Immutable ledger records
- MongoDB transactions for atomic transfers
- Environment-based secret management

### Never commit secrets

```text
.env
MongoDB credentials
JWT secrets
Gmail OAuth credentials
API keys
```

---

## 🧠 Backend Concepts Demonstrated

- REST API design
- MVC-style architecture
- Authentication & authorization
- JWT and cookie-based authentication
- Password hashing
- MongoDB and Mongoose schema design
- Database transactions
- Ledger-based accounting
- Idempotent API design
- Data integrity
- Immutable financial records
- Transaction lifecycle management
- Email service integration
- Environment-based configuration

---

## 🚧 Future Improvements

- Swagger/OpenAPI API documentation
- Automated unit and integration testing
- Request validation
- Rate limiting
- Refresh-token authentication
- Structured logging
- API versioning
- Docker containerization
- CI/CD pipeline
- Transaction history pagination and filtering
- Advanced financial reporting

---

## 👨‍💻 Author

**Bhupendra Singh**  
B.Tech — Computer Science & Engineering  
Ajay Kumar Garg Engineering College

GitHub: [@bhupendrar1](https://github.com/bhupendrar1)

---

## ⭐ Project

If you find **FinLedger** useful or interesting, consider giving the repository a ⭐.
