
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export async function apiRequest(path, options = {}) {
  const token = sessionStorage.getItem("balancevault_token");

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data;
}

export const api = {
  login: (email, password) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (fullName, email, password) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ fullName, email, password }),
    }),

  getAccounts: () => apiRequest("/accounts"),

  createAccount: (name, currency = "INR") =>
    apiRequest("/accounts", {
      method: "POST",
      body: JSON.stringify({ name, currency }),
    }),

  getLedger: (accountId) => apiRequest(`/accounts/${accountId}/ledger`),

  deposit: (accountId, amount) =>
    apiRequest(`/accounts/${accountId}/deposit`, {
      method: "POST",
      body: JSON.stringify({ amount: Number(amount) }),
    }),

  withdraw: (accountId, amount) =>
    apiRequest(`/accounts/${accountId}/withdraw`, {
      method: "POST",
      body: JSON.stringify({ amount: Number(amount) }),
    }),

  transfer: (accountId, destinationAccountId, amount) =>
    apiRequest(`/accounts/${accountId}/transfer`, {
      method: "POST",
      body: JSON.stringify({
        destinationAccountId,
        amount: Number(amount),
      }),
    }),

  getAdminUsers: () => apiRequest("/admin/users"),
  getOnboarding: () => apiRequest("/admin/onboarding"),
  getAuditLogs: () => apiRequest("/admin/audit"),

  reviewOnboarding: (requestId, decision, reviewNote = "") =>
    apiRequest(`/admin/onboarding/${requestId}`, {
      method: "PATCH",
      body: JSON.stringify({ decision, reviewNote }),
    }),
};
