import { useState } from "react";
import { Search, Users } from "lucide-react";
import { initialUsers } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";

export default function UsersPage() {
  const [query,setQuery] = useState("");
  const filtered = initialUsers.filter(u=>`${u.name} ${u.email} ${u.status}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="space-y-6">
    <div><p className="text-xs font-bold uppercase tracking-[.2em] text-blue-700">ADMINISTRATION</p><h1 className="mt-2 text-3xl font-extrabold text-slate-900">User management</h1><p className="mt-2 text-sm text-slate-500">Browse registered account holders.</p></div>
    <div className="flex max-w-md items-center gap-2 rounded-xl border border-slate-200 bg-white px-3"><Search size={18} className="text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search users..." className="w-full border-0 py-3 outline-none"/></div>
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white"><table className="w-full min-w-[650px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-4">User</th><th className="px-5 py-4">Role</th><th className="px-5 py-4">Onboarding</th><th className="px-5 py-4">Joined</th></tr></thead><tbody className="divide-y divide-slate-100">{filtered.map(u=><tr key={u.id}><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-blue-50 text-blue-700"><Users size={17}/></span><div><p className="font-bold text-slate-800">{u.name}</p><p className="text-xs text-slate-500">{u.email}</p></div></div></td><td className="px-5 py-4 font-semibold">{u.role}</td><td className="px-5 py-4"><StatusBadge status={u.status}/></td><td className="px-5 py-4 text-slate-500">{u.joined}</td></tr>)}</tbody></table>{filtered.length===0&&<p className="p-8 text-center text-sm text-slate-500">No users found.</p>}</div>
  </div>;
}
