
import { useEffect, useState } from "react";
import {
  ClipboardList,
  Clock3,
  ShieldCheck,
  Users,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";

import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import { api } from "../services/api";

function extractArray(data, keys) {
  if (Array.isArray(data)) return data;

  for (const key of keys) {
    if (Array.isArray(data?.[key])) {
      return data[key];
    }
  }

  if (Array.isArray(data?.data)) return data.data;

  return [];
}

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [onboarding, setOnboarding] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const [usersResult, onboardingResult, auditResult] =
        await Promise.all([
          api.getAdminUsers(),
          api.getOnboarding(),
          api.getAuditLogs(),
        ]);

      setUsers(
        extractArray(usersResult, ["users", "results"])
      );

      setOnboarding(
        extractArray(onboardingResult, [
          "requests",
          "onboarding",
          "onboardingRequests",
          "results",
        ])
      );

      setAuditLogs(
        extractArray(auditResult, [
          "logs",
          "auditLogs",
          "events",
          "results",
        ])
      );
    } catch (err) {
      setError(err.message || "Unable to load admin dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const pendingCount = onboarding.filter(
    (request) =>
      (request.status || request.onboardingStatus) === "PENDING"
  ).length;

  const recentUsers = [...users]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    )
    .slice(0, 5);

  const getUserName = (user) =>
    user.fullName ||
    user.name ||
    user.user?.fullName ||
    "Unknown user";

  const getUserEmail = (user) =>
    user.email || user.user?.email || "No email";

  const getUserStatus = (user) =>
    user.onboardingStatus ||
    user.status ||
    user.user?.onboardingStatus ||
    "PENDING";

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-blue-700">
            ADMINISTRATION
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
            Admin overview
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Monitor onboarding and user administration.
          </p>
        </div>

        <button
          onClick={loadDashboard}
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Registered users"
          value={loading ? "..." : users.length}
          note="Real registered users"
          icon={Users}
        />

        <StatCard
          title="Pending reviews"
          value={loading ? "..." : pendingCount}
          note="Require administrator attention"
          icon={Clock3}
          tone="amber"
        />

        <StatCard
          title="Audit events"
          value={loading ? "..." : auditLogs.length}
          note="Recorded activity"
          icon={ClipboardList}
          tone="violet"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link
          to="/admin/onboarding"
          className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-blue-300"
        >
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-amber-50 text-amber-700">
            <Clock3 />
          </span>

          <h2 className="mt-4 font-extrabold">
            Review onboarding
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Review pending account-holder registrations.
          </p>
        </Link>

        <Link
          to="/admin/users"
          className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-blue-300"
        >
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-700">
            <Users />
          </span>

          <h2 className="mt-4 font-extrabold">
            Manage users
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            View registered users and their roles.
          </p>
        </Link>

        <Link
          to="/admin/audit"
          className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-blue-300"
        >
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-violet-50 text-violet-700">
            <ShieldCheck />
          </span>

          <h2 className="mt-4 font-extrabold">
            Inspect audit trail
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Review recorded administrative activity.
          </p>
        </Link>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 font-extrabold">
          Recent registrations
        </h2>

        {loading ? (
          <p className="py-5 text-sm text-slate-500">
            Loading registrations...
          </p>
        ) : recentUsers.length === 0 ? (
          <p className="py-5 text-sm text-slate-500">
            No registered users found.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentUsers.map((user) => (
              <div
                key={user.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div>
                  <p className="text-sm font-bold">
                    {getUserName(user)}
                  </p>

                  <p className="text-xs text-slate-500">
                    {getUserEmail(user)}
                  </p>
                </div>

                <StatusBadge status={getUserStatus(user)} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
