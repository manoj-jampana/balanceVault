import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import Brand from "../components/Brand";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("user@balancevault.test");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [error, setError] = useState("");
  const { user, loginDemo } = useAuth();
  const navigate = useNavigate();

  if (user) return <Navigate to={user.role === "ADMIN" ? "/admin" : "/dashboard"} replace/>;

  function handleSubmit(event) {
    event.preventDefault();
    if (!email.includes("@") || password.length < 1) {
      setError("Enter a valid email and password.");
      return;
    }
    setError("");
    loginDemo(email, role);
    navigate(role === "ADMIN" ? "/admin" : "/dashboard");
  }

  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-[#102653] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-28 -top-24 h-96 w-96 rounded-full border border-white/10"/><div className="absolute -bottom-40 -left-24 h-[34rem] w-[34rem] rounded-full border border-white/10"/>
        <Brand light/>
        <div className="relative max-w-lg">
          <p className="mb-5 text-xs font-bold uppercase tracking-[.25em] text-blue-200">Your finances, organized</p>
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight">Clarity and control for every account.</h1>
          <p className="mt-6 max-w-md text-lg leading-8 text-blue-100/80">A secure account management experience with structured onboarding and accountable operations.</p>
        </div>
        <p className="text-xs text-blue-200/70">BalanceVault · Hackathon demonstration</p>
      </section>
      <section className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden"><Brand/></div>
          <p className="text-sm font-bold text-blue-700">WELCOME BACK</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">Sign in to BalanceVault</h2>
          <p className="mt-2 text-sm text-slate-500">Use the demo form to explore the frontend.</p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Email address</span><span className="relative block"><Mail className="absolute left-3 top-3.5 text-slate-400" size={18}/><input value={email} onChange={e=>setEmail(e.target.value)} type="email" required className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"/></span></label>
            <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Password</span><span className="relative block"><LockKeyhole className="absolute left-3 top-3.5 text-slate-400" size={18}/><input value={password} onChange={e=>setPassword(e.target.value)} type="password" required placeholder="Enter any demo password" className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"/></span></label>
            <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Demo view</span><select value={role} onChange={e=>setRole(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"><option value="USER">User dashboard</option><option value="ADMIN">Admin dashboard</option></select></label>
            {error && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3.5 font-bold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800">Sign in <ArrowRight size={18}/></button>
          </form>
          <p className="mt-7 text-center text-sm text-slate-500">New to BalanceVault? <Link to="/register" className="font-bold text-blue-700 hover:text-blue-900">Create an account</Link></p>
          <p className="mt-8 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-800">Demo only: this frontend uses a simulated session. It does not authenticate users or protect data. Backend authentication and authorization will be implemented separately.</p>
        </div>
      </section>
    </div>
  );
}
