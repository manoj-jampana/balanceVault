
# BalanceVault - Threat Model

## 1. Project Overview

BalanceVault is a demonstration account management application built with React, Node.js, Express, PostgreSQL, Prisma, and Redis.

It supports user registration, administrator approval, account management, simulated deposits, withdrawals, transfers, and audit logging.

No real money or payment processing is involved.

## 2. Assets to Protect

- User personal information.
- Password hashes.
- Authentication tokens.
- Account ownership and account records.
- Ledger entries and transaction history.
- Administrator privileges.
- Onboarding decisions.
- Audit logs.
- Database credentials and application secrets.

## 3. Threat Actors

- Unauthenticated external attackers.
- Authenticated users attempting privilege escalation.
- Malicious or compromised administrators.
- Attackers attempting to exploit exposed credentials.
- Users attempting to access another user's account data.

## 4. Threats, Impact and Mitigations

### T1. Unauthorized Access

Threat:
An unauthenticated person attempts to access protected account or administrator endpoints.

Impact:
Exposure or modification of protected information.

Mitigations:
- JWT authentication middleware.
- Protected API routes.
- Authentication checks before accessing protected resources.

Verification:
An unauthenticated request to `/api/admin/users` returned HTTP 401.

### T2. Privilege Escalation

Threat:
A normal user attempts to access administrator functionality.

Impact:
Unauthorized access to user management, onboarding decisions, and audit records.

Mitigations:
- Role-based authorization middleware.
- Administrator-only API routes.
- Backend authorization independent of frontend route protection.
- User role is loaded from the database during authentication checks.

Verification:
A logged-in normal user attempted to access `/api/admin/users` and received HTTP 403 Forbidden.

### T3. Insecure Direct Object Reference

Threat:
A user changes an account ID in an API request to access another user's account.

Impact:
Unauthorized access to account balances or ledger information.

Mitigations:
- Account ownership checks in account routes.
- User-specific account filtering.
- Ownership validation before account operations.

Verification:
Account ownership checks are implemented. Additional cross-user negative tests should be performed.

### T4. Password Exposure

Threat:
An attacker obtains stored passwords or intercepts credentials.

Impact:
Account compromise.

Mitigations:
- Passwords are hashed using bcrypt.
- Password hashes are stored instead of plaintext passwords.
- Authentication is performed through the backend.

Remaining consideration:
Production deployment must use HTTPS and secure secret management.

### T5. SQL Injection

Threat:
An attacker supplies malicious input to database queries.

Impact:
Unauthorized database access or modification.

Mitigations:
- Prisma ORM queries.
- Parameterized raw SQL for audit inserts and transaction locking.
- Zod request validation.

### T6. Audit Log Tampering

Threat:
An application user attempts to modify or delete audit records.

Impact:
Loss of accountability and investigation evidence.

Mitigations:
- Separate audit database credentials.
- Audit writer has INSERT-only access to audit logs.
- Runtime application role has SELECT access to audit logs.
- Audit insertion uses parameterized SQL.

Remaining consideration:
Database administrators and infrastructure-level attackers remain outside the protection of application-level permissions. Independent backups and retention controls are still required.

### T7. Unauthorized Financial Operations

Threat:
A user attempts to withdraw more than the available balance or transfer funds from another user's account.

Impact:
Incorrect ledger balances or unauthorized transactions.

Mitigations:
- Balance validation before withdrawal and transfer.
- Database transactions.
- Account row locking during withdrawal and transfer.
- Paired debit and credit entries for transfers.

Remaining consideration:
Deposit operations must also serialize against concurrent withdrawals. Idempotency protection for retried financial requests should be added.

### T8. Brute Force and Request Abuse

Threat:
An attacker repeatedly submits login or API requests.

Impact:
Service degradation or account compromise.

Mitigations:
- Redis-backed rate limiting.
- Input validation.
- Authentication controls.

### T9. Secret Leakage

Threat:
Database credentials, JWT secrets, or Redis credentials are exposed.

Impact:
Unauthorized access to infrastructure.

Mitigations:
- Environment variables.
- `.env` exclusion through Git ignore rules.
- `.env.example` contains configuration placeholders.

Remaining consideration:
Production secrets must be configured through deployment platform secret settings and rotated if exposed.

### T10. Cross-Site Scripting and Token Theft

Threat:
Malicious JavaScript executes in the application and accesses browser-stored tokens.

Impact:
Session compromise.

Current mitigation:
- React rendering and controlled application inputs.

Remaining consideration:
Access tokens are currently stored in sessionStorage. XSS could expose them. HttpOnly cookie-based authentication and additional XSS protections should be considered for production.

## 5. Security Testing Performed

| Test | Result |
|---|---|
| Unauthenticated admin API request | HTTP 401 |
| Normal user admin API request | HTTP 403 |
| Normal user frontend admin route | Redirected to allowed page |
| Admin dashboard data retrieval | Successful |
| Onboarding approval | Successful |
| Audit log retrieval | Successful |
| Account deposit, withdrawal and transfer | Previously tested through API |

## 6. Known Limitations

- This is a demonstration application, not a production banking platform.
- Deposits are simulated.
- No real payment gateway is integrated.
- Session revocation and refresh-token workflows are not fully implemented.
- Idempotency keys are not implemented.
- Additional concurrency and cross-user authorization tests are required.
- Audit retention, backups, and external tamper-evidence controls need further work.

## 7. Security Priorities Before Production

1. Complete cross-user account access tests.
2. Serialize all balance-changing operations.
3. Implement idempotency protection.
4. Review runtime database permissions.
5. Configure HTTPS and production secrets.
6. Add security headers and validate CORS configuration.
7. Test rate limiting and failure scenarios.
8. Establish audit backup and retention policies.
