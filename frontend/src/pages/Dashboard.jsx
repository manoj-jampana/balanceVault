import { ArrowUpRight, CreditCard, ShieldCheck, Clock3, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import { initialAccounts } from "../data/mockData";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const approved = user?.status === "APPROVED";
  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-blue-700">OVERVIEW</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">Good to see you, {user?.name?.split(" ")[0]}</h1><p className="mt-2 text-sm text-slate-500">Here is the current snapshot of your workspace.</p></div><Link to="/accounts" className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white hover:bg-blue-800"><Plus size={17}/> Manage accounts</Link></div>
      {!approved && <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900"><Clock3 className="shrink-0"/><div><p className="font-bold">Onboarding is pending</p><p className="mt-1 text-sm">Your registration is waiting for administrator review. Account operations are unavailable until approval.</p></div></div>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Total accounts" value={approved ? "02" : "00"} note="Accounts in this demo workspace" icon={CreditCard}/>
        <StatCard title="Onboarding status" value={user?.status || "PENDING"} note="Current registration status" icon={Clock3} tone="amber"/>
        <StatCard title="Security status" value="Protected UI" note="Server-side security is added in backend phase" icon={ShieldCheck} tone="green"/>
      </div>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between"><div><h2 className="text-lg font-extrabold text-slate-900">Your accounts</h2><p className="mt-1 text-sm text-slate-500">Sample account records for frontend development.</p></div><Link to="/accounts" className="text-sm font-bold text-blue-700">View all <ArrowUpRight className="inline" size={15}/></Link></div>
        {approved ? <div className="divide-y divide-slate-100">{initialAccounts.map(a=><div key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-4"><div><p className="font-bold text-slate-800">{a.name}</p><p className="mt-1 text-xs text-slate-500">{a.number}</p></div><StatusBadge status={a.status}/></div>)}</div> : <p className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">Your accounts will appear here after onboarding approval.</p>}
      </section>
    </div>
  );
}
