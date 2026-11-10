import { NavLink } from "react-router-dom";
import { LayoutDashboard, WalletCards, UserRoundCheck, Users, ScrollText, X } from "lucide-react";
import Brand from "./Brand";

const userLinks = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/accounts", label: "My accounts", icon: WalletCards },
];
const adminLinks = [
  { to: "/admin", label: "Admin overview", icon: LayoutDashboard },
  { to: "/admin/onboarding", label: "Onboarding", icon: UserRoundCheck },
  { to: "/admin/users", label: "User management", icon: Users },
  { to: "/admin/audit", label: "Audit trail", icon: ScrollText },
];

export default function Sidebar({ user, open, onClose }) {
  const links = user?.role === "ADMIN" ? adminLinks : userLinks;
  return (
    <>
      {open && <button aria-label="Close menu overlay" onClick={onClose} className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-68 flex-col border-r border-slate-200 bg-white px-5 py-6 transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between">
          <Brand />
          <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden" onClick={onClose}><X size={20}/></button>
        </div>
        <div className="mt-10">
          <p className="mb-3 px-3 text-xs font-bold uppercase tracking-widest text-slate-400">Workspace</p>
          <nav className="space-y-1">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} onClick={onClose} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${isActive ? "bg-blue-50 text-blue-800" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
                <Icon size={19}/>{label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="mt-auto rounded-2xl bg-slate-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800"><ShieldCheckIcon/> Security first</div>
          <p className="text-xs leading-5 text-slate-500">Demonstration workspace. Real authorization will be enforced by the backend.</p>
        </div>
      </aside>
    </>
  );
}

function ShieldCheckIcon() {
  return <span className="grid h-7 w-7 place-items-center rounded-lg bg-blue-100 text-blue-700">✓</span>;
}
