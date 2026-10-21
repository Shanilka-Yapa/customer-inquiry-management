import { ClipboardList, LogOut, LayoutDashboard, List, PlusCircle } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-amber-100 text-slate-950"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
    }`;

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="flex min-h-16 flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-3 text-left"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-slate-950">
            <ClipboardList size={22} />
          </div>

          <div>
            <h1 className="text-lg font-bold text-slate-900">InquiryDesk</h1>
            <p className="text-xs text-slate-500">
              Customer Inquiry Management
            </p>
          </div>
        </button>

        <nav className="order-3 flex w-full flex-wrap items-center gap-2 sm:order-none sm:w-auto">
          <NavLink to="/dashboard" className={navLinkClass}>
            <LayoutDashboard size={17} />
            Dashboard
          </NavLink>

          <NavLink to="/inquiries" className={navLinkClass}>
            <List size={17} />
            Inquiries
          </NavLink>

          <NavLink to="/inquiries/new" className={navLinkClass}>
            <PlusCircle size={17} />
            <span className="hidden md:inline">Create Inquiry</span>
            <span className="md:hidden">Create</span>
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-800">
              {user?.name || "Staff"}
            </p>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-amber-500 hover:bg-amber-50 hover:text-slate-950"
          >
            <LogOut size={17} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}