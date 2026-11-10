import { ClipboardList, Clock3, ShieldCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import { initialUsers } from "../data/mockData";

export default function AdminDashboard() {
  const pending = initialUsers.filter(u=>u.status==="PENDING").length;
  return <div className="space-y-7">
    <div><p className="text-xs font-bold uppercase tracking-[.2em] text-blue-700">ADMINISTRATION</p><h1 className="mt-2 text-3xl font-extrabold text-slate-900">Admin overview</h1><p className="mt-2 text-sm text-slate-500">Monitor onboarding and user administration.</p></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"><StatCard title="Registered users" value={initialUsers.length} note="Sample user records" icon={Users}/><StatCard title="Pending reviews" value={pending} note="Require administrator attention" icon={Clock3} tone="amber"/><StatCard title="Audit events" value="03" note="Sample activity records" icon={ClipboardList} tone="violet"/></div>
    <div className="grid gap-4 md:grid-cols-2"><Link to="/admin/onboarding" className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-blue-300"><span className="grid h-11 w-11 place-items-center rounded-xl bg-amber-50 text-amber-700"><Clock3/></span><h2 className="mt-4 font-extrabold">Review onboarding</h2><p className="mt-1 text-sm text-slate-500">Review pending account-holder registrations.</p></Link><Link to="/admin/audit" className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-blue-300"><span className="grid h-11 w-11 place-items-center rounded-xl bg-violet-50 text-violet-700"><ShieldCheck/></span><h2 className="mt-4 font-extrabold">Inspect audit trail</h2><p className="mt-1 text-sm text-slate-500">Review recorded administrative activity.</p></Link></div>
    <section className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="mb-4 font-extrabold">Recent registrations</h2><div className="divide-y divide-slate-100">{initialUsers.map(u=><div key={u.id} className="flex flex-wrap items-center justify-between gap-3 py-3"><div><p className="text-sm font-bold">{u.name}</p><p className="text-xs text-slate-500">{u.email}</p></div><StatusBadge status={u.status}/></div>)}</div></section>
  </div>;
}
