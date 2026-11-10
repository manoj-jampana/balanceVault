import { useState } from "react";
import { Plus, Search, WalletCards } from "lucide-react";
import { initialAccounts } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";

export default function Accounts() {
  const [accounts,setAccounts] = useState(initialAccounts);
  const [query,setQuery] = useState("");
  const [showForm,setShowForm] = useState(false);
  const [name,setName] = useState("");
  const filtered = accounts.filter(a => `${a.name} ${a.number}`.toLowerCase().includes(query.toLowerCase()));

  function addAccount(e) {
    e.preventDefault();
    const item = { id: crypto.randomUUID(), number: `BV-DEMO-${String(accounts.length+1).padStart(4,"0")}`, name: name.trim(), type: "Personal", status: "Active", created: new Date().toISOString().slice(0,10) };
    setAccounts(prev=>[item,...prev]); setName(""); setShowForm(false);
  }

  return <div className="space-y-6">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-blue-700">ACCOUNT MANAGEMENT</p><h1 className="mt-2 text-3xl font-extrabold text-slate-900">My accounts</h1><p className="mt-2 text-sm text-slate-500">View and organize your account records.</p></div><button onClick={()=>setShowForm(v=>!v)} className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white hover:bg-blue-800"><Plus size={17}/> Add account</button></div>
    {showForm && <form onSubmit={addAccount} className="flex flex-col gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-5 sm:flex-row"><input value={name} onChange={e=>setName(e.target.value)} required minLength={2} maxLength={60} placeholder="Account display name" className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"/><button className="rounded-xl bg-blue-700 px-5 py-3 font-bold text-white">Save account</button></form>}
    <div className="flex max-w-md items-center gap-2 rounded-xl border border-slate-200 bg-white px-3"><Search size={18} className="text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search accounts..." className="w-full border-0 py-3 outline-none"/></div>
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="grid grid-cols-[1fr_auto] gap-4 border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500"><span>Account</span><span>Status</span></div>{filtered.map(a=><div key={a.id} className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-slate-100 px-5 py-5 last:border-0"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-700"><WalletCards size={20}/></span><div><p className="font-bold text-slate-800">{a.name}</p><p className="mt-1 text-xs text-slate-500">{a.number} · {a.type}</p></div></div><StatusBadge status={a.status}/></div>)}{filtered.length===0 && <p className="p-8 text-center text-sm text-slate-500">No accounts match your search.</p>}</div>
    <p className="text-xs text-slate-400">Demo data only. Account creation is local to this browser and is not saved to a database.</p>
  </div>;
}
