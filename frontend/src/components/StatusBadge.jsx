export default function StatusBadge({ status }) {
  const styles = {
    APPROVED: "bg-emerald-50 text-emerald-700",
    Active: "bg-emerald-50 text-emerald-700",
    PENDING: "bg-amber-50 text-amber-700",
    REJECTED: "bg-rose-50 text-rose-700",
    Frozen: "bg-slate-100 text-slate-700",
    SUCCESS: "bg-emerald-50 text-emerald-700",
  };
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${styles[status] || "bg-slate-100 text-slate-600"}`}>{status}</span>;
}
