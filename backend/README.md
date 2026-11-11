# BalanceVault backend

Express + PostgreSQL + Prisma backend baseline.

## Requirements
Node.js 20+, Neon PostgreSQL, and Redis (local or hosted TCP/TLS endpoint).

## Setup
1. Copy `.env.example` to `.env` and fill in the Neon pooled, direct and audit-writer connection URLs. Never commit `.env`.
2. Generate a JWT secret in PowerShell: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.
3. Install: `npm install`
4. Generate Prisma client: `npm run db:generate`
5. Create migration: `npm run db:migrate -- --name init`
6. Start Redis and configure `REDIS_URL`.
7. Start API: `npm run dev` (http://localhost:4000).

## Endpoints
- GET `/api/health`, GET `/api/ready`
- POST `/api/auth/register`, POST `/api/auth/login`
- GET/POST `/api/accounts`, GET `/api/accounts/:id/ledger`
- GET `/api/admin/users`, GET `/api/admin/onboarding`
- PATCH `/api/admin/onboarding/:id`, GET `/api/admin/audit`

Send `Authorization: Bearer <accessToken>` to protected routes.

## Environment URLs
`DATABASE_URL` is the pooled runtime connection; `DIRECT_URL` is the direct Prisma migration connection; `AUDIT_DATABASE_URL` is a separate restricted audit writer connection. Configure these with matching roles before running the server.

## Honest feature status
This is a starter backend, not a production financial service. The first admin is bootstrapped manually as documented in `docs/SECURITY.md`. Full double-entry transfers, immutable audit enforcement and comprehensive security tests remain to be implemented and verified. Use synthetic data only.
