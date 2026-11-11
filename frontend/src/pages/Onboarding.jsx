
import { useCallback, useEffect, useState } from "react";
import {
  Check,
  X,
  UserRoundCheck,
  RefreshCw,
  Clock3,
} from "lucide-react";

import StatusBadge from "../components/StatusBadge";
import { api } from "../services/api";

function extractRequests(data) {
  if (Array.isArray(data)) return data;

  return (
    data?.requests ||
    data?.onboarding ||
    data?.onboardingRequests ||
    data?.data ||
    []
  );
}

function getApplicant(request) {
  return request.user || request.applicant || request;
}

function getName(request) {
  const applicant = getApplicant(request);

  return (
    applicant.fullName ||
    applicant.name ||
    "Unknown applicant"
  );
}

function getEmail(request) {
  const applicant = getApplicant(request);

  return applicant.email || "No email available";
}

function getStatus(request) {
  return (
    request.status ||
    request.onboardingStatus ||
    request.user?.onboardingStatus ||
    request.applicant?.onboardingStatus ||
    "PENDING"
  );
}

export default function Onboarding() {
  const [requests, setRequests] = useState([]);
  const [reviewNotes, setReviewNotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await api.getOnboarding();
      setRequests(extractRequests(result));
    } catch (err) {
      setError(err.message || "Unable to load onboarding requests.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const updateRequest = async (request, decision) => {
    if (!request.id) {
      setError("Request ID is missing. Cannot update this application.");
      return;
    }

    const applicantName = getName(request);

    const confirmed = window.confirm(
      `Are you sure you want to ${decision.toLowerCase()} ${applicantName}?`
    );

    if (!confirmed) return;

    setProcessingId(request.id);
    setError("");
    setSuccess("");

    try {
      await api.reviewOnboarding(
        request.id,
        decision,
        reviewNotes[request.id] || ""
      );

      setSuccess(
        `${applicantName} has been ${decision.toLowerCase()} successfully.`
      );

      setReviewNotes((previous) => {
        const updated = { ...previous };
        delete updated[request.id];
        return updated;
      });

      await loadRequests();
    } catch (err) {
      setError(err.message || "Unable to update application.");
    } finally {
      setProcessingId(null);
    }
  };

  const pendingRequests = requests.filter(
    (request) => getStatus(request) === "PENDING"
  );

  const reviewedRequests = requests.filter(
    (request) => getStatus(request) !== "PENDING"
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-blue-700">
            ADMINISTRATION
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
            Onboarding review
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Review new registrations and record a decision.
          </p>
        </div>

        <button
          onClick={loadRequests}
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

      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          {success}
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-extrabold">
              Pending applications
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {loading ? "Loading..." : `${pendingRequests.length} waiting for review`}
            </p>
          </div>

          <span className="rounded-xl bg-amber-50 px-3 py-2 text-sm font-bold text-amber-700">
            {pendingRequests.length} pending
          </span>
        </div>

        {loading ? (
          <p className="py-8 text-center text-sm text-slate-500">
            Loading onboarding applications...
          </p>
        ) : pendingRequests.length === 0 ? (
          <p className="rounded-xl bg-emerald-50 p-5 text-sm text-emerald-800">
            There are no pending applications.
          </p>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <article
                key={request.id}
                className="rounded-xl border border-slate-100 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-blue-50 text-blue-700">
                      <UserRoundCheck />
                    </span>

                    <div>
                      <p className="font-bold">
                        {getName(request)}
                      </p>

                      <p className="text-xs text-slate-500">
                        {getEmail(request)}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Request ID: {request.id}
                      </p>
                    </div>
                  </div>

                  <StatusBadge status={getStatus(request)} />
                </div>

                <div className="mt-4">
                  <label className="mb-2 block text-xs font-semibold text-slate-600">
                    Review note (optional)
                  </label>

                  <textarea
                    rows={2}
                    value={reviewNotes[request.id] || ""}
                    onChange={(event) =>
                      setReviewNotes((previous) => ({
                        ...previous,
                        [request.id]: event.target.value,
                      }))
                    }
                    placeholder="Add an optional review note..."
                    className="w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
                    maxLength={500}
                  />
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={() => updateRequest(request, "REJECTED")}
                    disabled={processingId !== null}
                    className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-3 py-2 text-sm font-bold text-rose-700 hover:bg-rose-50 disabled:opacity-50"
                  >
                    <X size={16} />
                    {processingId === request.id ? "Processing..." : "Reject"}
                  </button>

                  <button
                    onClick={() => updateRequest(request, "APPROVED")}
                    disabled={processingId !== null}
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    <Check size={16} />
                    {processingId === request.id ? "Processing..." : "Approve"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-2">
          <Clock3 size={19} className="text-slate-500" />
          <h2 className="font-extrabold">
            Previously reviewed applications
          </h2>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : reviewedRequests.length === 0 ? (
          <p className="text-sm text-slate-500">
            No reviewed applications yet.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {reviewedRequests.map((request) => (
              <div
                key={request.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div>
                  <p className="text-sm font-bold">
                    {getName(request)}
                  </p>
                  <p className="text-xs text-slate-500">
                    {getEmail(request)}
                  </p>
                </div>

                <StatusBadge status={getStatus(request)} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
