import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  RefreshCw,
  ClipboardList,
  Eye,
  CalendarDays,
  CircleAlert,
  Inbox,
} from "lucide-react";
import api from "../api/api";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

const statusStyles = {
  NEW: "bg-blue-50 text-blue-700 ring-blue-600/20",
  IN_PROGRESS: "bg-amber-50 text-amber-700 ring-amber-600/20",
  RESOLVED: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
};

const statusLabels = {
  NEW: "New",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
};

function formatDate(date) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default function Inquiries() {
  const { user } = useAuth();

  const isOwnInquiry = (inquiry) =>
    user?.id != null && Number(inquiry.createdById) === Number(user.id);
  const [inquiries, setInquiries] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchInquiries = useCallback(async () => {
    try {
      setError("");

      const response = await api.get("/inquiries");
      setInquiries(response.data.inquiries || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load inquiries. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const filteredInquiries = inquiries.filter((inquiry) => {
    const query = search.toLowerCase().trim();

    const matchesSearch =
      !query ||
      inquiry.customerName?.toLowerCase().includes(query) ||
      inquiry.subject?.toLowerCase().includes(query) ||
      inquiry.contact?.toLowerCase().includes(query);

    const matchesStatus = status === "ALL" || inquiry.status === status;

    return matchesSearch && matchesStatus;
  });

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page heading */}
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">
              Customer Support
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Inquiries
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              View, search, and track customer inquiries.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                fetchInquiries();
              }}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-amber-400 hover:bg-amber-50 disabled:opacity-60"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>

            <Link
              to="/inquiries/new"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-amber-400"
            >
              <Plus size={18} />
              New Inquiry
            </Link>
          </div>
        </section>

        {/* Summary */}
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            {
              label: "Total",
              value: inquiries.length,
              color: "text-slate-900",
            },
            {
              label: "New",
              value: inquiries.filter((item) => item.status === "NEW").length,
              color: "text-blue-600",
            },
            {
              label: "In Progress",
              value: inquiries.filter((item) => item.status === "IN_PROGRESS")
                .length,
              color: "text-amber-600",
            },
            {
              label: "Resolved",
              value: inquiries.filter((item) => item.status === "RESOLVED")
                .length,
              color: "text-emerald-600",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className={`mt-2 text-2xl font-bold ${item.color}`}>
                {loading ? "—" : item.value}
              </p>
            </div>
          ))}
        </section>

        {/* Search and filters */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                placeholder="Search customer, subject, or contact..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
              />
            </div>

            <div className="w-full md:w-52">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                aria-label="Filter inquiries by status"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
              >
                <option value="ALL">All statuses</option>
                <option value="NEW">New</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span>
              {loading
                ? "Loading inquiries..."
                : `Showing ${filteredInquiries.length} of ${inquiries.length} inquiries`}
            </span>

            {(search || status !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatus("ALL");
                }}
                className="font-semibold text-amber-700 hover:text-amber-800"
              >
                Clear filters
              </button>
            )}
          </div>
        </section>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-2">
              <CircleAlert size={18} className="shrink-0" />
              <span>{error}</span>
            </div>

            <button
              type="button"
              onClick={() => {
                setLoading(true);
                fetchInquiries();
              }}
              className="font-semibold underline underline-offset-4"
            >
              Try again
            </button>
          </div>
        )}

        {/* Inquiry table */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="space-y-4 p-6">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-14 animate-pulse rounded-lg bg-slate-100"
                />
              ))}
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <CircleAlert size={32} className="mx-auto text-red-400" />
              <p className="mt-3 text-sm text-slate-500">
                Unable to display inquiry data.
              </p>
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                {inquiries.length === 0 ? (
                  <ClipboardList size={28} />
                ) : (
                  <Inbox size={28} />
                )}
              </div>

              <h3 className="mt-4 text-base font-bold text-slate-900">
                {inquiries.length === 0
                  ? "No inquiries yet"
                  : "No matching inquiries"}
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {inquiries.length === 0
                  ? "Create your first inquiry to get started."
                  : "Try changing your search terms or selecting a different status."}
              </p>

              {inquiries.length === 0 && (
                <Link
                  to="/inquiries/new"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-amber-400"
                >
                  <Plus size={17} />
                  Create Inquiry
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Subject
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Status
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Created
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Action
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Created By
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredInquiries.map((inquiry) => (
                      <tr
                        key={inquiry.id}
                        className={`transition ${
                          isOwnInquiry(inquiry)
                            ? "outline outline-1 -outline-offset-1 outline-amber-400/80 shadow-[inset_0_0_12px_rgba(245,158,11,0.12)] hover:bg-amber-50/20"
                            : "hover:bg-slate-50"
                        }`}
                      >
                        <td className="whitespace-nowrap px-6 py-4">
                          <p className="text-sm font-semibold text-slate-900">
                            {inquiry.customerName}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {inquiry.contact}
                          </p>
                        </td>

                        <td className="max-w-xs px-6 py-4">
                          <p className="truncate text-sm text-slate-700">
                            {inquiry.subject}
                          </p>
                        </td>

                        <td className="whitespace-nowrap px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
                              statusStyles[inquiry.status] ||
                              "bg-slate-100 text-slate-600 ring-slate-200"
                            }`}
                          >
                            {statusLabels[inquiry.status] || inquiry.status}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-6 py-4">
                          <span className="inline-flex items-center gap-2 text-sm text-slate-500">
                            <CalendarDays size={15} />
                            {formatDate(inquiry.createdAt)}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-right">
                          <Link
                            to={`/inquiries/${inquiry.id}`}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-amber-400 hover:bg-amber-50 hover:text-slate-950"
                          >
                            <Eye size={15} />
                            View
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900">
                            {inquiry.createdBy?.name || "Unknown"}
                          </div>
                          <div className="text-xs text-slate-500">
                            Staff ID:{" "}
                            {inquiry.createdBy?.id ?? inquiry.createdById}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="divide-y divide-slate-100 md:hidden">
                {filteredInquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className={`space-y-3 p-5 ${
                      isOwnInquiry(inquiry)
                        ? "bg-white outline outline-1 -outline-offset-1 outline-amber-400/80 shadow-[inset_0_0_12px_rgba(245,158,11,0.12)]"
                        : "bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900">
                          {inquiry.customerName}
                        </p>
                        <p className="mt-1 truncate text-xs text-slate-500">
                          {inquiry.contact}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
                          statusStyles[inquiry.status] ||
                          "bg-slate-100 text-slate-600 ring-slate-200"
                        }`}
                      >
                        {statusLabels[inquiry.status] || inquiry.status}
                      </span>
                    </div>

                    <p className="break-words text-sm text-slate-700">
                      {inquiry.subject}
                    </p>

                    <p className="flex items-center gap-2 text-xs text-slate-400">
                      <CalendarDays size={14} />
                      {formatDate(inquiry.createdAt)}
                    </p>

                    <Link
                      to={`/inquiries/${inquiry.id}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700 hover:text-amber-800"
                    >
                      <Eye size={16} />
                      View details
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </Layout>
  );
}