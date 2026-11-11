-- TEMPLATE: review and run as the Neon database owner after the first Prisma migration.
-- Create distinct login roles and set their passwords through Neon role management/secure SQL tooling.
CREATE ROLE bv_app_runtime LOGIN;
CREATE ROLE bv_app_migrator LOGIN;
CREATE ROLE bv_audit_writer LOGIN;
GRANT CONNECT ON DATABASE balancevault_db TO bv_app_runtime, bv_app_migrator, bv_audit_writer;
GRANT USAGE ON SCHEMA public TO bv_app_runtime, bv_audit_writer;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE users, accounts, onboarding_requests, ledger_entries, sessions TO bv_app_runtime;
GRANT SELECT ON TABLE audit_logs TO bv_app_runtime;
GRANT INSERT ON TABLE audit_logs TO bv_audit_writer;
REVOKE UPDATE, DELETE, TRUNCATE ON TABLE audit_logs FROM bv_audit_writer;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE audit_logs FROM bv_app_runtime;
-- Apply appropriate sequence/default privileges if you later add serial/identity columns.
-- Prisma UUID primary keys avoid sequence grants in this initial schema.
-- Validate these permissions by connecting with each role. Do not run the application as owner.
