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

**Threat:**

An unauthenticated person attempts to access protected account or administrator endpoints.

**Impact:**

Exposure or modification of protected information.

**Mitigations:**

- JWT authentication middleware.
- Protected API routes.
- Authentication checks before accessing protected resources.

**Verification:**

An unauthenticated request to `/api/admin/users` returned HTTP 401 Unauthorized.

### T2. Privilege Escalation

**Threat:**

A normal user attempts to access administrator functionality.

**Impact:**

Unauthorized access to user management, onboarding decisions, and audit records.

**Mitigations:**

- Role-based authorization middleware.
- Administrator-only API routes.
- Backend authorization independent of frontend route protection.
- User role is loaded from the database during authentication checks.

**Verification:**

A logged-in normal user attempted to access `/api/admin/users` and received HTTP 403 Forbidden. The normal user's attempt to access the frontend `/admin` route was also redirected.

### T3. Insecure Direct Object Reference (IDOR)

**Threat:**

A user changes an account ID in an API request to access another user's account.

**Impact:**

Unauthorized access to account balances or ledger information.

**Mitigations:**

- Account ownership checks in account routes.
- User-specific account filtering.
- Ownership validation before account operations.

**Verification:**

Account ownership checks are implemented. Additional negative tests using another user's account ID are still required.

### T4. Password Exposure

**Threat:**

An attacker obtains stored passwords or intercepts credentials.

**Impact:**

Account compromise.

**Mitigations:**

- Passwords are hashed using bcrypt.
- Password hashes are stored instead of plaintext passwords.
- Authentication is performed through the backend.
- The deployed application uses HTTPS.

**Remaining consideration:**

Password security also depends on secure secret management, transport security, and protection against account takeover attempts.

### T5. SQL Injection

**Threat:**

An attacker supplies malicious input to database queries.

**Impact:**

Unauthorized database access or modification.

**Mitigations:**

- Prisma ORM queries.
- Parameterized raw SQL for audit inserts and transaction locking.
- Zod request validation.

**Remaining consideration:**

All raw SQL queries and future database operations should continue to use parameterized inputs.

### T6. Audit Log Tampering

**Threat:**

An application user attempts to modify or delete audit records.

**Impact:**

Loss of accountability and investigation evidence.

**Mitigations:**

- Separate audit database credentials.
- Audit writer has INSERT-only access to audit logs.
- Runtime application role has SELECT access to audit logs.
- Audit insertion uses parameterized SQL.

**Verification:**

The separate audit connection was tested successfully against the development database.

**Remaining consideration:**

Database administrators and infrastructure-level attackers remain outside the protection of application-level permissions. Independent backups, retention controls, and external tamper-evidence mechanisms are still required.

### T7. Unauthorized Financial Operations

**Threat:**

A user attempts to withdraw more than the available balance or transfer funds from another user's account.

**Impact:**

Incorrect ledger balances or unauthorized transactions.

**Mitigations:**

- Balance validation before withdrawal and transfer.
- Database transactions.
- Account row locking during withdrawal and transfer.
- Paired debit and credit entries for transfers.
- Account ownership validation before operations.

**Verification:**

Deposit, withdrawal, and transfer operations were tested using synthetic accounts through the API.

**Remaining consideration:**

Deposit operations still need row locking to serialize them against concurrent withdrawals and transfers. Idempotency protection for retried financial requests should also be added.

### T8. Brute Force and Request Abuse

**Threat:**

An attacker repeatedly submits login or API requests.

**Impact:**

Service degradation or account compromise.

**Mitigations:**

- Redis-backed rate limiting.
- Input validation.
- Authentication controls.

**Remaining consideration:**

Rate-limit thresholds, HTTP responses, and behavior under repeated login attempts require dedicated security testing.

### T9. Secret Leakage

**Threat:**

Database credentials, JWT secrets, or Redis credentials are exposed.

**Impact:**

Unauthorized access to infrastructure.

**Mitigations:**

- Environment variables.
- `.env` exclusion through Git ignore rules.
- `.env.example` contains configuration placeholders.
- Production environment variables configured through the deployment platform.

**Remaining consideration:**

Production secrets must remain private and be rotated immediately if exposed. They must never be committed to GitHub or included in public documentation.

### T10. Cross-Site Scripting and Token Theft

**Threat:**

Malicious JavaScript executes in the application and accesses browser-stored tokens.

**Impact:**

Session compromise.

**Current mitigation:**

- React rendering helps escape text content by default.
- Application inputs are validated.
- Access tokens are stored in sessionStorage rather than persistent localStorage.

**Remaining consideration:**

React's default escaping does not prevent every form of XSS. Access tokens stored in sessionStorage can be accessed by injected JavaScript. HttpOnly cookie-based authentication, Content Security Policy, and additional XSS protections should be considered.

## 5. Security Testing Performed

| Test | Result |
|---|---|
| Unauthenticated admin API request | HTTP 401 |
| Normal user admin API request | HTTP 403 |
| Normal user frontend admin route | Redirected to allowed page |
| Admin dashboard data retrieval | Successful |
| Onboarding approval | Successful |
| Audit log retrieval | Successful |
| Account deposit, withdrawal and transfer | Tested through API using synthetic accounts |
| Separate audit database connection | INSERT tested successfully |
| Production health endpoint | Successful |
| Production readiness endpoint | Database and Redis reported OK |

**Testing scope:** Some security and database permission tests were performed against the development database. Successful deployment and health checks do not independently prove that every security control has been tested in production.

## 6. Known Limitations

- This is a demonstration application, not a production banking platform.
- Deposits are simulated.
- No real payment gateway is integrated.
- Session revocation and refresh-token workflows are not fully implemented.
- Idempotency keys are not implemented.
- Additional concurrency and cross-user authorization tests are required.
- Deposit operations need additional concurrency protection.
- Audit retention, backups, and external tamper-evidence controls need further work.
- Access tokens stored in sessionStorage remain exposed to successful XSS attacks.
- Automated security test coverage is limited.

## 7. Security Priorities for Further Improvement

1. Complete cross-user account access tests.
2. Serialize all balance-changing operations, including deposits.
3. Implement idempotency protection.
4. Review runtime database permissions.
5. Verify production database role permissions.
6. Review HTTPS, production secrets, and CORS configuration.
7. Add and verify security headers.
8. Test rate limiting and failure scenarios.
9. Establish audit backup and retention policies.
10. Consider HttpOnly cookie-based authentication and stronger XSS protections.