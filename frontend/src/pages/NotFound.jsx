import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <h1 className="text-5xl font-bold text-slate-900">404</h1>
      <p className="mt-3 text-slate-600">Page not found.</p>
      <Link
        to="/dashboard"
        className="mt-6 rounded-lg bg-amber-600 px-5 py-3 font-medium text-white hover:bg-amber-700"
      >
        Back to dashboard
      </Link>
    </main>
  );
}
