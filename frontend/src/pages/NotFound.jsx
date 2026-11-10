import { Link } from "react-router-dom";
export default function NotFound() {
  return <div className="grid min-h-screen place-items-center bg-slate-50 p-6 text-center"><div><p className="text-sm font-bold text-blue-700">404 ERROR</p><h1 className="mt-2 text-4xl font-extrabold">Page not found</h1><p className="mt-3 text-slate-500">The page you requested does not exist.</p><Link className="mt-6 inline-block rounded-xl bg-blue-700 px-5 py-3 font-bold text-white" to="/">Return home</Link></div></div>;
}
