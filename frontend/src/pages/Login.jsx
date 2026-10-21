import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ClipboardList, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to log in. Please check your connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-2">
      <section className="relative hidden flex-col justify-between overflow-hidden bg-slate-950 p-12 text-white lg:flex xl:p-16">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500 text-slate-950">
            <ClipboardList size={27} />
          </div>
          <span className="text-2xl font-bold tracking-tight">
            Inquiry<span className="text-amber-400">Desk</span>
          </span>
        </div>

        <div className="relative max-w-lg">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-amber-400">
            Customer Inquiry Management
          </p>

          <h1 className="text-4xl font-bold leading-tight xl:text-5xl">
            Every inquiry.
            <br />
            Every update.
            <br />
            <span className="text-amber-400">One workspace.</span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-7 text-slate-400">
            Keep customer requests organised, track their progress, and make
            sure every inquiry gets the attention it deserves.
          </p>

          <div className="mt-10 flex items-center gap-3 text-sm text-slate-300">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            Simple tracking. Clear accountability.
          </div>
        </div>

        <p className="relative text-sm text-slate-500">
          © 2026 InquiryDesk · Shanilka T. Yapa
        </p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-slate-950">
                <ClipboardList size={25} />
              </div>
              <span className="text-2xl font-bold text-slate-950">
                Inquiry<span className="text-amber-600">Desk</span>
              </span>
            </div>
          </div>

          <p className="text-sm font-semibold text-amber-700">WELCOME BACK</p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            Sign in to your account
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Enter your details to access your inquiry workspace.
          </p>

          {error && (
            <div
              role="alert"
              className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
                placeholder="staff@coffeeninja.com"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700"
                >
                  Password
                </label>
              </div>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(event) =>
                    setForm({ ...form, password: event.target.value })
                  }
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-3.5 font-semibold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-amber-700 hover:text-amber-800"
            >
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
