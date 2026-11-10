import { Search, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { initialAudit } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";

export default function Audit() {
  const [query,setQuery] = useState("");
  const rows = initialAudit.filter(e=>`${e.action} ${e.actor} ${e.target}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="space-y-6">
    <div><p className="text-xs font-bold uppercase tracking-[.2em] text-blue-700">SECURITY & ACCOUNTABILITY</p><h1 className="mt-2 text-3xl font-extrabold text-slate-900">Audit trail</h1><p className="mt-2 text-sm text-slate-500">A readable history of important account activity.</p></div>
    <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-blue-900"><ShieldCheck className="mt-0.5 shrink-0"/><p className="text-sm leading-6"><strong>Audit visibility:</strong> This screen displays sample events. In the connected application, audit events will be read from the backend and access will be restricted to administrators.</p></div>
    <div className="flex max-w-md items-center gap-2 rounded-xl border border-slate-200 bg-white px-3"><Search size={18} className="text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search audit events..." className="w-full border-0 py-3 outline-none"/></div>
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-4">Action</th><th className="px-5 py-4">Actor</th><th className="px-5 py-4">Target</th><th className="px-5 py-4">Time</th><th className="px-5 py-4">Outcome</th></tr></thead><tbody className="divide-y divide-slate-100">{rows.map(e=><tr key={e.id}><td className="px-5 py-4 font-bold text-slate-800">{e.action}</td><td className="px-5 py-4 text-slate-600">{e.actor}</td><td className="px-5 py-4 text-slate-600">{e.target}</td><td className="px-5 py-4 text-slate-500">{e.time}</td><td className="px-5 py-4"><StatusBadge status={e.outcome}/></td></tr>)}</tbody></table>{rows.length===0&&<p className="p-8 text-center text-sm text-slate-500">No events found.</p>}</div>
    <p className="text-xs text-slate-400">Application-level display does not itself make logs immutable. Database permissions and protected retention are backend responsibilities.</p>
  </div>;
}
