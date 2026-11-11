
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import Brand from "../components/Brand";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, login } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return (
      <Navigate
        to={user.role === "ADMIN" ? "/admin" : "/dashboard"}
        replace
      />
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const loggedInUser = await login(email.trim(), password);

      navigate(
        loggedInUser.role === "ADMIN" ? "/admin" : "/dashboard"
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-[#102653] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Brand light />
        <div className="relative max-w-lg">
          <p className="mb-5 text-xs font-bold uppercase tracking-[.25em] text-blue-200">
            Your finances, organized
          </p>
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight">
            Clarity and control for every account.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-8 text-blue-100/80">
            A secure account management experience with structured
            onboarding and accountable operations.
          </p>
        </div>
        <p className="text-xs text-blue-200/70">
          BalanceVault · Hackathon demonstration
        </p>
      </section>

      <section className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden">
            <Brand />
          </div>

          <p className="text-sm font-bold text-blue-700">WELCOME BACK</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
            Sign in to BalanceVault
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Sign in using your registered account.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Email address
              </span>
              <span className="relative block">
                <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </span>
              <span className="relative block">
                <LockKeyhole className="absolute left-3 top-3.5 text-slate-400" size={18} />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </span>
            </label>

            {error && (
              <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
                {error}
              </p>
            )}

            <button
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3.5 font-bold text-white hover:bg-blue-800 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-500">
            New to BalanceVault?{" "}
            <Link to="/register" className="font-bold text-blue-700">
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
