# 🏦 Banking Transaction System

A backend banking and ledger service built with **Node.js, Express.js, MongoDB, JWT authentication, and Nodemailer**. The project provides user authentication, bank account management, balance tracking, and transaction handling through REST APIs.

## ✨ Features

- 🔐 User registration and login
- 🎟️ JWT-based authentication
- 🍪 Cookie-based authentication support
- 🚪 User logout
- 🏦 Create and manage user bank accounts
- 💰 Check account balances
- 💸 Create authenticated transactions
- 🧾 Ledger-style transaction processing
- 🛡️ Protected routes using authentication middleware
- ⚙️ System-user protected endpoint for initial funds
- 📧 Email service integration with Nodemailer
- 🗄️ MongoDB database integration using Mongoose
- 🔑 Environment-variable based configuration

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API framework |
| MongoDB | Database |
| Mongoose | MongoDB ODM |
| JSON Web Token (JWT) | Authentication |
| bcryptjs | Password hashing |
| Nodemailer | Email service |
| Cookie Parser | Cookie handling |
| dotenv | Environment variables |

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
│   │   ├── transaction.model.js
│   │   └── user.model.js
│   └── routes/
│       ├── account.routes.js
│       ├── auth.routes.js
│       └── transaction.routes.js
│
├── .env
├── package.json
├── server.js
└── README.md
```

## 🚀 Getting Started

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

Create a `.env` file in the project root and configure the values required by your database, authentication, and email service.

> **Security:** Never commit `.env`, database credentials, JWT secrets, email OAuth credentials, refresh tokens, or any other secrets to GitHub.

### 4. Start the development server

```bash
npm run dev
```

Or:

```bash
npm start
```

The server is configured to run on:

```text
http://localhost:3000
```

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate a user |
| POST | `/api/auth/logout` | Logout the current user |

### Accounts

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| POST | `/api/accounts/` | Create a new account | 🔒 Required |
| GET | `/api/accounts/` | Get accounts of the logged-in user | 🔒 Required |
| GET | `/api/accounts/balance/:accountId` | Get an account balance | 🔒 Required |

### Transactions

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| POST | `/api/transactions/` | Create a transaction | 🔒 Required |
| POST | `/api/transactions/system/initial-funds` | Create an initial-funds transaction | 🔐 System user |

## 🔐 Authentication Flow

```text
Client
  │
  ├── Register ──► POST /api/auth/register
  │
  ├── Login ─────► POST /api/auth/login
  │                 │
  │                 └──► JWT / Authentication Cookie
  │
  ├── Account APIs ─────► Auth Middleware
  │
  └── Transaction APIs ─► Auth Middleware
  │
  ▼
Controllers
  │
  ▼
MongoDB
```

Protected account and transaction routes pass through authentication middleware before reaching their controllers.

## 📊 Application Architecture

```text
                    ┌─────────────────┐
                    │     Client      │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Express.js API │
                    └────────┬────────┘
                             │
          ┌──────────────────┼──────────────────┐
          ▼                  ▼                  ▼
   Authentication         Accounts         Transactions
          │                  │                  │
          └──────────────────┼──────────────────┘
                             ▼
                    ┌─────────────────┐
                    │    Middleware   │
                    └────────┬────────┘
                             ▼
                    ┌─────────────────┐
                    │   Controllers   │
                    └────────┬────────┘
                             ▼
                    ┌─────────────────┐
                    │    Mongoose     │
                    └────────┬────────┘
                             ▼
                    ┌─────────────────┐
                    │    MongoDB      │
                    └─────────────────┘
```

## 🧪 Available Scripts

```bash
npm run dev    # Start development server with Nodemon
npm start      # Start server with Node.js
npm test       # Test command placeholder
```

## 🛡️ Security Practices

- Passwords are handled with `bcryptjs` rather than being stored as plaintext.
- Authentication uses JWT.
- Sensitive configuration is intended to be supplied through environment variables.
- Account and transaction endpoints are protected by authentication middleware.
- Database and email credentials should never be committed to source control.
- Use HTTPS and appropriate production security controls when deploying.

## 🔮 Future Improvements

- Add comprehensive automated tests with Jest and Supertest
- Add request validation and stronger input sanitization
- Add transaction history, search, and filtering
- Add pagination for accounts and transactions
- Add robust transaction rollback and failure handling
- Add Swagger/OpenAPI documentation
- Add rate limiting and security headers
- Add Docker support
- Add CI/CD with GitHub Actions
- Deploy the API to a cloud platform

## 👨‍💻 Author

**Bhupendra Singh**

GitHub: [@bhupendrar1](https://github.com/bhupendrar1)

## 📄 License

This project currently uses the **ISC License**, as specified in `package.json`.

---

⭐ If you find this project useful, consider giving it a star!