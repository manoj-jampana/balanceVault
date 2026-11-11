
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  ShieldCheck,
  RefreshCw,
  ClipboardList,
} from "lucide-react";

import StatusBadge from "../components/StatusBadge";
import { api } from "../services/api";

function extractLogs(data) {
  if (Array.isArray(data)) return data;

  return (
    data?.logs ||
    data?.auditLogs ||
    data?.events ||
    data?.results ||
    data?.data ||
    []
  );
}

function formatDate(date) {
  if (!date) return "Not available";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "Not available";

  return parsed.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function Audit() {
  const [logs, setLogs] = useState([]);
  const [query, setQuery] = useState("");
  const [outcomeFilter, setOutcomeFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLogs = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await api.getAuditLogs();
      setLogs(extractLogs(result));
    } catch (err) {
      setError(err.message || "Unable to load audit events.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const action = log.action || "";
      const actor =
        log.actor?.fullName ||
        log.actor?.email ||
        log.actorEmail ||
        log.actorId ||
        "System";

      const resourceType = log.resourceType || "";
      const resourceId = log.resourceId || "";
      const outcome = log.outcome || "UNKNOWN";

      const searchableText =
        `${action} ${actor} ${resourceType} ${resourceId} ${outcome}`.toLowerCase();

      const matchesSearch = searchableText.includes(
        query.trim().toLowerCase()
      );

      const matchesOutcome =
        outcomeFilter === "ALL" || outcome === outcomeFilter;

      return matchesSearch && matchesOutcome;
    });
  }, [logs, query, outcomeFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-blue-700">
            SECURITY & ACCOUNTABILITY
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
            Audit trail
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            A readable history of important account activity.
          </p>
        </div>

        <button
          onClick={loadLogs}
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

      <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-blue-900">
        <ShieldCheck className="mt-0.5 shrink-0" />

        <p className="text-sm leading-6">
          <strong>Audit visibility:</strong> Events are retrieved from the
          backend. Access to this information must be restricted to
          authorized administrators.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Total audit events</p>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">
            {loading ? "..." : logs.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Events displayed</p>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">
            {loading ? "..." : filteredLogs.length}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex max-w-md flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3">
          <Search size={18} className="text-slate-400" />

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search action, actor, resource..."
            className="w-full border-0 py-3 outline-none"
          />
        </div>

        <select
          value={outcomeFilter}
          onChange={(event) => setOutcomeFilter(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
        >
          <option value="ALL">All outcomes</option>
          <option value="SUCCESS">Success</option>
          <option value="FAILURE">Failure</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[850px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-5 py-4">Action</th>
              <th className="px-5 py-4">Actor</th>
              <th className="px-5 py-4">Resource</th>
              <th className="px-5 py-4">Time</th>
              <th className="px-5 py-4">Outcome</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-500">
                  Loading audit events...
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => {
                const actor =
                  log.actor?.fullName ||
                  log.actor?.email ||
                  log.actorEmail ||
                  log.actorId ||
                  "System";

                const resource = [
                  log.resourceType || "Unknown resource",
                  log.resourceId || "",
                ]
                  .filter(Boolean)
                  .join(" · ");

                return (
                  <tr key={log.id}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <ClipboardList
                          size={17}
                          className="text-blue-600"
                        />
                        <span className="font-bold text-slate-800">
                          {log.action || "Unknown action"}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {actor}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {resource}
                    </td>

                    <td className="px-5 py-4 text-slate-500">
                      {formatDate(log.createdAt || log.timestamp)}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={log.outcome || "UNKNOWN"} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {!loading && filteredLogs.length === 0 && (
          <p className="p-8 text-center text-sm text-slate-500">
            No audit events found.
          </p>
        )}
      </div>

      <p className="text-xs text-slate-400">
        Audit integrity is enforced through backend database permissions.
        This page provides read-only visibility and does not modify audit records.
      </p>
    </div>
  );
}
