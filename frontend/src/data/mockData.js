export const initialAccounts = [
  { id: "acc-1001", number: "BV-4821-0091", name: "Primary Account", type: "Personal", status: "Active", created: "2026-10-12" },
  { id: "acc-1002", number: "BV-4821-0092", name: "Savings Account", type: "Savings", status: "Active", created: "2026-10-18" },
];

export const initialUsers = [
  { id: "usr-1001", name: "Aarav Sharma", email: "aarav@example.test", role: "USER", status: "APPROVED", joined: "2026-10-12" },
  { id: "usr-1002", name: "Diya Reddy", email: "diya@example.test", role: "USER", status: "PENDING", joined: "2026-11-08" },
  { id: "usr-1003", name: "Kabir Mehta", email: "kabir@example.test", role: "USER", status: "REJECTED", joined: "2026-11-09" },
];

export const initialAudit = [
  { id: "evt-01", action: "USER_REGISTERED", actor: "diya@example.test", target: "User usr-1002", time: "2026-11-10 09:42", outcome: "SUCCESS" },
  { id: "evt-02", action: "ONBOARDING_APPROVED", actor: "admin@balancevault.test", target: "User usr-1001", time: "2026-11-10 09:15", outcome: "SUCCESS" },
  { id: "evt-03", action: "LOGIN_SUCCEEDED", actor: "aarav@example.test", target: "User usr-1001", time: "2026-11-10 08:54", outcome: "SUCCESS" },
];
