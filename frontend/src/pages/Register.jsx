import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Brand from "../components/Brand";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confirm,setConfirm] = useState("");
  const [error,setError] = useState("");
  const { registerDemo } = useAuth();
  const navigate = useNavigate();

  function submit(e) {
    e.preventDefault();
    if (name.trim().length < 2) return setError("Name must contain at least 2 characters.");
    if (password.length < 12) return setError("For this demo, use at least 12 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    registerDemo(name.trim(), email.trim());
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] px-4 py-10">
      <div className="mx-auto max-w-xl">
        <Link to="/login" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-700"><ArrowLeft size={16}/> Back to sign in</Link>
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
          <Brand/>
          <p className="mt-9 text-xs font-bold tracking-[.2em] text-blue-700">GET STARTED</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">Create your account</h1>
          <p className="mt-2 text-sm text-slate-500">Submit your details to begin the onboarding process.</p>
          <form onSubmit={submit} className="mt-8 space-y-5">
            <label className="block"><span className="mb-2 block text-sm font-semibold">Full name</span><input value={name} onChange={e=>setName(e.target.value)} required minLength={2} maxLength={80} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"/></label>
            <label className="block"><span className="mb-2 block text-sm font-semibold">Email address</span><input value={email} onChange={e=>setEmail(e.target.value)} required type="email" maxLength={254} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"/></label>
            <label className="block"><span className="mb-2 block text-sm font-semibold">Password</span><input value={password} onChange={e=>setPassword(e.target.value)} required type="password" minLength={12} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"/><span className="mt-1 block text-xs text-slate-400">At least 12 characters in this demo form.</span></label>
            <label className="block"><span className="mb-2 block text-sm font-semibold">Confirm password</span><input value={confirm} onChange={e=>setConfirm(e.target.value)} required type="password" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"/></label>
            {error && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3.5 font-bold text-white hover:bg-blue-800">Submit registration <ArrowRight size={18}/></button>
          </form>
          <p className="mt-6 text-center text-xs leading-5 text-slate-500">Registration is simulated locally. The real server will validate, hash and store credentials in a later phase.</p>
        </div>
      </div>
    </div>
  );
}
