import { Bell, Menu, LogOut, UserCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Topbar({ onMenu }) {
  const { user, logout } = useAuth();
  return (
    <header className="sticky top-0 z-20 flex h-18 items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur md:px-8">
      <button onClick={onMenu} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" aria-label="Open navigation"><Menu/></button>
      <div className="hidden text-sm text-slate-500 sm:block">Workspace <span className="mx-2 text-slate-300">/</span><span className="font-semibold text-slate-800">BalanceVault</span></div>
      <div className="ml-auto flex items-center gap-3">
        <button className="rounded-xl p-2 text-slate-500 hover:bg-slate-100" aria-label="Notifications"><Bell size={19}/></button>
        <div className="hidden items-center gap-2 border-l border-slate-200 pl-4 sm:flex">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-blue-100 text-blue-800"><UserCircle2 size={21}/></div>
          <div className="leading-tight"><p className="text-sm font-bold text-slate-800">{user?.name}</p><p className="text-xs text-slate-500">{user?.role}</p></div>
        </div>
        <button onClick={logout} className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"><LogOut size={16}/><span className="hidden sm:inline">Sign out</span></button>
      </div>
    </header>
  );
}
