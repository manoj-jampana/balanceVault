import { useState } from "react";
import { Check, X, UserRoundCheck } from "lucide-react";
import { initialUsers } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";

export default function Onboarding() {
  const [users,setUsers] = useState(initialUsers);
  function update(id,status) { setUsers(prev=>prev.map(u=>u.id===id?{...u,status}:u)); }
  const pending = users.filter(u=>u.status==="PENDING");
  return <div className="space-y-6">
    <div><p className="text-xs font-bold uppercase tracking-[.2em] text-blue-700">ADMINISTRATION</p><h1 className="mt-2 text-3xl font-extrabold text-slate-900">Onboarding review</h1><p className="mt-2 text-sm text-slate-500">Review new registrations and record a decision.</p></div>
    <div className="rounded-2xl border border-slate-200 bg-white p-5"><div className="mb-5 flex items-center justify-between"><div><h2 className="font-extrabold">Pending applications</h2><p className="mt-1 text-sm text-slate-500">{pending.length} waiting for review</p></div><span className="rounded-xl bg-amber-50 px-3 py-2 text-sm font-bold text-amber-700">{pending.length} pending</span></div>
      {pending.length ? <div className="space-y-3">{pending.map(u=><article key={u.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-100 p-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-blue-50 text-blue-700"><UserRoundCheck/></span><div><p className="font-bold">{u.name}</p><p className="text-xs text-slate-500">{u.email} · Joined {u.joined}</p></div></div><div className="flex gap-2"><button onClick={()=>update(u.id,"REJECTED")} className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-3 py-2 text-sm font-bold text-rose-700 hover:bg-rose-50"><X size={16}/> Reject</button><button onClick={()=>update(u.id,"APPROVED")} className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-bold text-white hover:bg-emerald-700"><Check size={16}/> Approve</button></div></article>)}</div> : <p className="rounded-xl bg-emerald-50 p-5 text-sm text-emerald-800">There are no pending applications in this demo.</p>}
    </div>
    <p className="text-xs text-slate-400">Demo only: decisions update in local component state. The backend phase will enforce administrator authorization and persist decisions.</p>
  </div>;
}
