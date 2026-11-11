
import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Users, RefreshCw } from "lucide-react";

import StatusBadge from "../components/StatusBadge";
import { api } from "../services/api";

function extractUsers(data) {
  if (Array.isArray(data)) return data;

  return data?.users || data?.results || data?.data || [];
}

function formatDate(date) {
  if (!date) return "Not available";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "Not available";

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await api.getAdminUsers();
      setUsers(extractUsers(result));
    } catch (err) {
      setError(err.message || "Unable to load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const name = user.fullName || user.name || "";
      const email = user.email || "";
      const role = user.role || "USER";
      const status =
        user.onboardingStatus || user.status || "PENDING";

      const searchText =
        `${name} ${email} ${role} ${status}`.toLowerCase();

      const matchesSearch = searchText.includes(
        query.toLowerCase().trim()
      );

      const matchesRole =
        roleFilter === "ALL" || role === roleFilter;

      const matchesStatus =
        statusFilter === "ALL" || status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, query, roleFilter, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-blue-700">
            ADMINISTRATION
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
            User management
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Browse registered account holders and their access roles.
          </p>
        </div>

        <button
          onClick={loadUsers}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Total registered users</p>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">
            {loading ? "..." : users.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Users shown</p>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">
            {loading ? "..." : filteredUsers.length}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <div className="flex max-w-md flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3">
          <Search size={18} className="text-slate-400" />

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, email, role..."
            className="w-full border-0 py-3 outline-none"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(event) => setRoleFilter(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
        >
          <option value="ALL">All roles</option>
          <option value="ADMIN">Admin</option>
          <option value="USER">User</option>
        </select>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
        >
          <option value="ALL">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-5 py-4">User</th>
              <th className="px-5 py-4">Role</th>
              <th className="px-5 py-4">Onboarding</th>
              <th className="px-5 py-4">Joined</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-slate-500">
                  Loading users...
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const name = user.fullName || user.name || "Unknown user";
                const email = user.email || "No email";
                const role = user.role || "USER";
                const status =
                  user.onboardingStatus || user.status || "PENDING";

                return (
                  <tr key={user.id}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-blue-50 text-blue-700">
                          <Users size={17} />
                        </span>

                        <div>
                          <p className="font-bold text-slate-800">
                            {name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                        {role}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={status} />
                    </td>

                    <td className="px-5 py-4 text-slate-500">
                      {formatDate(user.createdAt || user.joined)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {!loading && filteredUsers.length === 0 && (
          <p className="p-8 text-center text-sm text-slate-500">
            No users found.
          </p>
        )}
      </div>
    </div>
  );
}
