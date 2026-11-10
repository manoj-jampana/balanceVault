import { ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function Brand({ light = false }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2 font-extrabold tracking-tight ${light ? "text-white" : "text-slate-900"}`}>
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-700 text-white shadow-sm">
        <ShieldCheck size={23} />
      </span>
      <span className="text-xl">Balance<span className={light ? "text-blue-200" : "text-blue-700"}>Vault</span></span>
    </Link>
  );
}
