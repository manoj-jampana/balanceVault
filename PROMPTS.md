# BalanceVault - AI Usage Log

This document records AI assistance used during development.

The entries summarize actual development discussions and implementation work. Code was reviewed, adapted, and tested during development.

## Entry 1 - 2026-11-10 - Backend Architecture

### Prompt
Help design a secure account management application using React, Node.js, PostgreSQL, Prisma, and Redis.

### AI assistance
- Suggested backend folder organization.
- Helped design authentication and authorization middleware.
- Helped define Prisma database models.
- Suggested separate database roles for runtime, migration, and audit operations.

### What needed correction
Database permissions and Prisma operations required additional testing.

### How it was addressed
Database roles were configured and tested against the development database.

### Related commits
- Database migration: https://github.com/manoj-jampana/balanceVault/commit/762fa59
- Backend implementation: https://github.com/manoj-jampana/balanceVault/commit/e665957

---

## Entry 2 - 2026-11-10 - Authentication and Authorization

### Prompt
Implement registration, login, password hashing, JWT authentication, and administrator-only routes.

### AI assistance
- Helped implement bcrypt password hashing.
- Helped implement JWT verification.
- Suggested loading user roles from the database.
- Helped implement administrator route protection.

### What needed correction
Frontend route protection alone was insufficient to protect administrator data.

### How it was addressed
Backend authorization middleware was used to enforce administrator permissions independently of the frontend.

### Related commit
https://github.com/manoj-jampana/balanceVault/commit/e665957

---

## Entry 3 - 2026-11-10 - Audit Logging

### Prompt
Implement audit logging with a separate database role that cannot update or delete audit records.

### AI assistance
- Helped design a separate audit database connection.
- Suggested INSERT-only audit permissions.
- Helped implement parameterized SQL for audit insertion.

### What needed correction
The initial Prisma create operation encountered a database permission error.

### How it was addressed
Audit insertion was changed to a parameterized raw SQL INSERT statement. The audit connection was tested successfully.

### Related commit
https://github.com/manoj-jampana/balanceVault/commit/e665957

---

## Entry 4 - 2026-11-11 - Account Operations

### Prompt
Implement deposit, withdrawal, transfer, and ledger history using PostgreSQL transactions.

### AI assistance
- Helped implement balance calculations from ledger entries.
- Suggested database transactions and row locking.
- Helped implement ownership checks.
- Helped implement paired ledger entries for transfers.

### What needed correction
The initial account routes did not include all required operations.

### How it was addressed
Deposit, withdrawal, transfer, and ledger endpoints were implemented and tested using synthetic accounts.

### Related commit
https://github.com/manoj-jampana/balanceVault/commit/e665957

---

## Entry 5 - 2026-11-11 - Frontend Integration

### Prompt
Connect the React frontend to the actual backend authentication and account APIs.

### AI assistance
- Helped create a centralized API service.
- Helped connect login and registration.
- Helped integrate account operations.
- Helped replace mock data in the admin dashboard.

### What needed correction
An incorrect hook export and duplicate declarations caused frontend errors.

### How it was addressed
API service logic and authentication context were separated into their respective files. The frontend was tested again.

### Related commit
https://github.com/manoj-jampana/balanceVault/commit/855c9b5

---

## Entry 6 - 2026-11-11 - Authorization Security Testing

### Prompt
Verify that a normal user cannot access administrator pages or administrator APIs.

### AI assistance
- Suggested frontend route authorization tests.
- Suggested backend API authorization tests.
- Explained the difference between HTTP 401 and HTTP 403.

### What needed correction
The first frontend test used an incorrect route.

### How it was addressed
The correct `/admin` route was tested. The normal user was redirected to an allowed page. A logged-in normal user received HTTP 403 from `/api/admin/users`.

### Related commits
- Backend authorization implementation: https://github.com/manoj-jampana/balanceVault/commit/e665957
- Frontend integration: https://github.com/manoj-jampana/balanceVault/commit/855c9b5

---

## Entry 7 - 2026-11-11 - Admin Audit Interface

### Prompt
Connect the administrator audit page to the real backend audit API.

### AI assistance
- Helped replace sample audit events with API data.
- Added search and outcome filtering.
- Added loading and error states.

### What needed correction
The original audit page displayed sample data instead of persisted database events.

### How it was addressed
The page was connected to the backend audit endpoint and verified with actual audit records.

### Related commit
https://github.com/manoj-jampana/balanceVault/commit/855c9b5