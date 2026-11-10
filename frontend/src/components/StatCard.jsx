export default function StatCard({ title, value, note, icon: Icon, tone = "blue" }) {
  const tones = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    violet: "bg-violet-50 text-violet-700",
  };
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div><p className="text-sm font-medium text-slate-500">{title}</p><p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">{value}</p></div>
        <span className={`grid h-11 w-11 place-items-center rounded-xl ${tones[tone]}`}><Icon size={21}/></span>
      </div>
      <p className="mt-4 text-xs text-slate-500">{note}</p>
    </article>
  );
}
