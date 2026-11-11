# Security notes and unfinished work

This is a hackathon development baseline, not a production banking system. Use synthetic data only. It is not connected to payment rails and must not handle real funds.

## Least-privilege database roles
- `bv_app_runtime`: normal application data access; read-only access to audit rows.
- `bv_audit_writer`: INSERT-only audit access.
- `bv_app_migrator`: reserved for migrations. Migration privileges and schema ownership must be reviewed and explicitly granted for the Neon setup.

The role SQL is a template. Review role membership, ownership, schema privileges and default privileges in Neon. Set passwords securely in Neon; never commit them. The runtime app must not use the database owner login.

## First administrator bootstrap
There is deliberately no public admin-registration endpoint. After a trusted user registers, a database owner may promote the specifically verified account once:
```sql
UPDATE users SET role = 'ADMIN', onboarding_status = 'APPROVED'
WHERE email = 'your-verified-admin-email@example.com';
```
Perform this manually with a controlled owner session, record who performed it, and never accept an admin email from an unauthenticated client. The manual bootstrap is not yet an immutable audit procedure.

## Important unfinished security work before evaluation
- Add session/refresh-token rotation, revocation and logout.
- Add robust transaction idempotency, concurrency controls and double-entry debit/credit transactions.
- Add database constraints/triggers proving ledger transaction balance and preventing ledger/audit mutation.
- Add account freeze/close operations and comprehensive ownership/IDOR tests.
- Add tests for privilege escalation, role bypass, audit tampering, SQL grants and rate limits using separate database logins.
- Review proxy trust, CORS, deployment secrets, logging and monitoring.

The current schema contains ledger entries but does not yet implement a complete money movement workflow. Do not claim that money transfers or real balances are implemented.
