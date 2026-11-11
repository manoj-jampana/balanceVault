# BalanceVault – Secure Account Management System

<p align="center">
  A Full-Stack Secure Account Management Application
</p>

<p align="center">
  React • Node.js • Express • PostgreSQL • Prisma • Redis
</p>

## Live Demo

| Component | Link |
|---|---|
| Live Application | https://balance-vault-beta.vercel.app/login |
| Backend API | https://balancevault-363x.onrender.com |
| Backend Health | https://balancevault-363x.onrender.com/api/health |
| Backend Readiness | https://balancevault-363x.onrender.com/api/ready |
| GitHub Repository | https://github.com/manoj-jampana/balanceVault |

---

## 1. Project Overview

BalanceVault is a full-stack account management application designed to demonstrate secure authentication, role-based access control, account operations, user onboarding, transaction ledger tracking, and audit logging.

The application provides separate experiences for normal users and administrators.

Users can register, request account access, manage their accounts, and perform simulated financial operations. Administrators can review onboarding requests, manage users, and monitor audit events.

**Important:** BalanceVault is an educational demonstration application. It does not process real money or connect to real banking or payment systems.

## 2. Problem Statement

Account management applications require secure user authentication, controlled access to resources, reliable transaction records, and administrative oversight.

BalanceVault addresses these requirements through a centralized platform that provides:

- Secure user registration and authentication.
- Administrator-controlled onboarding approval.
- Role-based access control.
- Account ownership validation.
- Simulated deposits, withdrawals, and transfers.
- Ledger-based transaction history.
- Audit logging for accountability.

## 3. Key Features

### User Authentication
- User registration and login.
- Password hashing using bcrypt.
- JWT-based authentication.
- Database-backed role verification.
- Protected API endpoints.
- Pending users cannot access protected account features until approved.

### Account Management
- Create and view accounts.
- Account ownership validation.
- Simulated deposits.
- Withdrawals with balance validation.
- Transfers between eligible accounts.
- Transaction ledger and history.
- Account balances calculated from ledger entries.

### Administrator Dashboard
- View registered users.
- View onboarding requests.
- Approve or reject onboarding applications.
- View audit records.
- Search and filter user information.
- Search and filter audit events.

### Security Features
- Role-based access control (RBAC).
- Backend authorization middleware.
- Separate PostgreSQL database roles.
- Parameterized SQL queries.
- Redis-backed rate limiting.
- Zod request validation.
- Database transactions.
- Row locking for withdrawals and transfers.
- Restricted audit database permissions.

## 4. Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router |
| Icons | Lucide React |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | JWT, bcrypt |
| Validation | Zod |
| Rate Limiting | Redis, Upstash |
| Database Hosting | Neon |
| Backend Hosting | Render |
| Frontend Hosting | Vercel |
| Version Control | Git, GitHub |

## 5. System Architecture

```text
                 USER / ADMIN
                      |
                      v
              React Frontend
                  Vercel
                      |
                 REST API
                      |
                      v
              Node.js + Express
                   Render
                      |
          +-----------+-----------+
          |           |           |
          v           v           v
      PostgreSQL    Redis      JWT Auth
        Neon        Upstash
          |
    +-----+------------------+
    |            |           |
    v            v           v
 Runtime      Migration     Audit
 Database       Role       Writer
   Role
```

### Architecture Description

1. The React frontend provides the user and administrator interfaces.
2. The Express backend exposes REST API endpoints.
3. JWT authentication verifies the identity of users.
4. Backend middleware enforces role-based authorization.
5. PostgreSQL stores users, accounts, onboarding requests, ledger entries, and audit logs.
6. Prisma manages database access and migrations.
7. Redis supports request rate limiting.
8. Separate database credentials restrict runtime, migration, and audit operations.

## 6. Database Design

BalanceVault uses PostgreSQL with Prisma ORM.

### Main Database Models

| Model | Responsibility |
|---|---|
| User | Stores user details, password hashes, roles, and onboarding status |
| Account | Stores account details and ownership |
| OnboardingRequest | Stores onboarding applications and administrator decisions |
| LedgerEntry | Stores debit and credit transaction entries |
| AuditLog | Stores application audit events |
| Session | Stores session-related records |

### Ledger-Based Balance Calculation

Account balances are calculated from ledger entries.

- CREDIT entries increase the balance.
- DEBIT entries decrease the balance.
- Transfers create corresponding debit and credit entries using a shared transaction reference.

This demonstration does not maintain a separate account balance column.

## 7. Application Workflow

1. A new user registers.
2. The backend hashes the password using bcrypt.
3. A user record and onboarding request are created.
4. The user remains in pending status.
5. An administrator reviews the onboarding request.
6. The administrator approves or rejects the application.
7. Approved users can log in and access account features.
8. Users can create accounts and perform simulated operations.
9. Ledger entries record account operations.
10. Audit records provide visibility into application activities.

## 8. API Documentation

All API endpoints are served through:

`https://balancevault-363x.onrender.com/api`

### Health and Readiness

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Application health check |
| GET | `/api/ready` | Database and Redis readiness |

### Authentication APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate a user |

### Account APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/accounts` | Retrieve user's accounts |
| POST | `/api/accounts` | Create an account |
| GET | `/api/accounts/:id/ledger` | Retrieve account ledger |
| POST | `/api/accounts/:id/deposit` | Perform simulated deposit |
| POST | `/api/accounts/:id/withdraw` | Withdraw funds |
| POST | `/api/accounts/:id/transfer` | Transfer between accounts |

### Administrator APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/users` | Retrieve registered users |
| GET | `/api/admin/onboarding` | Retrieve onboarding requests |
| PATCH | `/api/admin/onboarding/:id` | Approve or reject onboarding |
| GET | `/api/admin/audit` | Retrieve audit records |

### Authentication Header

Protected endpoints require a JWT access token:

```http
Authorization: Bearer <accessToken>
```

Administrator endpoints additionally require the ADMIN role.

## 9. Project Structure

```text
BalanceVault/
│
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   │
│   ├── src/
│   │   ├── config/
│   │   ├── db/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── database/
│   ├── docs/
│   ├── tests/
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── README.md
│
├── README.md
├── PROMPTS.md
├── THREATS.md
└── .gitignore
```

## 10. Local Installation and Setup

### Prerequisites

- Node.js 20+
- npm
- PostgreSQL database
- Redis instance
- Git

### Clone the Repository

```bash
git clone https://github.com/manoj-jampana/balanceVault.git
cd balanceVault
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file using `.env.example` as a reference.

Configure:

```env
NODE_ENV=development
DATABASE_URL=your_pooled_database_url
DIRECT_URL=your_direct_database_url
AUDIT_DATABASE_URL=your_audit_database_url
JWT_ACCESS_SECRET=your_jwt_secret
REDIS_URL=your_redis_connection_url
FRONTEND_URL=http://localhost:5173
```

Generate a JWT secret using PowerShell:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Generate the Prisma client:

```bash
npm run db:generate
```

Apply development migrations using the project's configured migration script:

```bash
npm run db:migrate -- --name init
```

Start Redis and configure the `REDIS_URL`.

Start the backend:

```bash
npm run dev
```

Backend runs at:

`http://localhost:4000`

### Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create a frontend `.env` file:

```env
VITE_API_URL=http://localhost:4000/api
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at:

`http://localhost:5173`

### Production Build

To create the frontend production build:

```bash
npm run build
```

The build output is generated in the `dist` directory.

## 11. Deployment

BalanceVault is deployed using the following services:

| Component | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| PostgreSQL | Neon |
| Redis | Upstash |

### Live Deployment URLs

**Frontend:**

https://balance-vault-beta.vercel.app/login

**Backend:**

https://balancevault-363x.onrender.com

**Health Check:**

https://balancevault-363x.onrender.com/api/health

**Readiness Check:**

https://balancevault-363x.onrender.com/api/ready

Production environment variables are configured through the hosting platforms. Database credentials, JWT secrets, and Redis credentials must never be committed to GitHub.

## 12. Security Testing

The following checks have been performed during development and deployment:

| Test | Observed Result |
|---|---|
| Unauthenticated administrator API request | HTTP 401 |
| Normal user administrator API request | HTTP 403 |
| Normal user frontend administrator route | Redirected |
| Administrator dashboard data retrieval | Successful |
| Onboarding approval | Successful |
| Audit log retrieval | Successful |
| Account deposit, withdrawal, and transfer | Tested through API |
| Separate audit database connection | INSERT tested successfully |
| Production backend health check | Successful |
| Production database readiness | Successful |
| Production Redis readiness | Successful |

Automated backend test coverage is currently limited. Additional cross-user authorization, concurrency, and rate-limiting tests remain necessary.

See [THREATS.md](THREATS.md) for the detailed threat model, mitigations, testing scope, and known limitations.

## 13. AI Usage Documentation

AI assistance was used during development for:

- Backend architecture discussions.
- Database schema design.
- Authentication and authorization implementation guidance.
- Audit logging and database permission debugging.
- Account operation implementation.
- Frontend integration.
- Security reviews and documentation.

Generated suggestions were reviewed, adapted, and tested during development.

See [PROMPTS.md](PROMPTS.md) for the dated AI usage log, corrections, and related GitHub commits.

## 14. Known Limitations and Future Improvements

- Implement idempotency keys for financial operations.
- Add concurrency protection for deposit operations.
- Complete cross-user account access tests.
- Expand automated integration and security testing.
- Improve session revocation and refresh-token management.
- Consider HttpOnly cookie-based authentication.
- Add and verify security headers and XSS protections.
- Establish independent audit backups and retention policies.
- Review and minimize runtime database permissions.
- Improve audit reliability and failure handling.

---

## Author

**Manoj Kumar Jampana**

GitHub: https://github.com/manoj-jampana

Project Repository: https://github.com/manoj-jampana/balanceVault

Live Project: https://balance-vault-beta.vercel.app/login