
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Brand from "../components/Brand";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (name.trim().length < 2) {
      setError("Name must contain at least 2 characters.");
      return;
    }

    if (password.length < 12) {
      setError("Password must contain at least 12 characters.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const result = await register(name.trim(), email.trim(), password);
      setSuccess(
        result.message || "Registration submitted. Await administrator approval."
      );

      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] px-4 py-10">
      <div className="mx-auto max-w-xl">
        <Link to="/login" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500">
          <ArrowLeft size={16} /> Back to sign in
        </Link>

        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
          <Brand />
          <p className="mt-9 text-xs font-bold tracking-[.2em] text-blue-700">
            GET STARTED
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Submit your details to begin onboarding.
          </p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Full name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                maxLength={100}
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Email address</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
                maxLength={254}
                autoComplete="email"
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Password</span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                type="password"
                minLength={12}
                autoComplete="new-password"
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
              />
              <span className="mt-1 block text-xs text-slate-400">
                At least 12 characters.
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Confirm password</span>
              <input
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                type="password"
                autoComplete="new-password"
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
              />
            </label>

            {error && (
              <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
                {error}
              </p>
            )}

            {success && (
              <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                {success}
              </p>
            )}

            <button
              disabled={loading || !!success}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3.5 font-bold text-white hover:bg-blue-800 disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit registration"}
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
