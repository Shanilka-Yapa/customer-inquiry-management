import { useCallback, useEffect, useState } from "react";
import {
  ClipboardList,
  Clock3,
  CheckCircle2,
  CircleAlert,
  RefreshCw,
  CalendarDays,
  ArrowUpRight,
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

function StatCard({ title, value, description, icon: Icon, iconStyle }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>

        <div className={`rounded-xl p-3 ${iconStyle}`}>
          <Icon size={22} />
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-500">{description}</p>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();

  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isOwnInquiry = (inquiry) =>
    user?.id != null &&
    Number(inquiry.createdById) === Number(user.id);

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

  const total = inquiries.length;
  const newCount = inquiries.filter((item) => item.status === "NEW").length;
  const inProgressCount = inquiries.filter(
    (item) => item.status === "IN_PROGRESS"
  ).length;
  const resolvedCount = inquiries.filter(
    (item) => item.status === "RESOLVED"
  ).length;

  const recentInquiries = [...inquiries]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Page heading */}
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">
              Overview
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Dashboard
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Monitor customer inquiries and track their progress.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setLoading(true);
              fetchInquiries();
            }}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-amber-400 hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
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

        {/* Statistics */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">
              Inquiry Overview
            </h3>

            <span className="text-xs text-slate-400">
              {loading ? "Updating..." : "Live data"}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Inquiries"
              value={loading ? "—" : total}
              description="All customer inquiries"
              icon={ClipboardList}
              iconStyle="bg-slate-100 text-slate-700"
            />

            <StatCard
              title="New Inquiries"
              value={loading ? "—" : newCount}
              description="Waiting to be addressed"
              icon={Inbox}
              iconStyle="bg-blue-50 text-blue-600"
            />

            <StatCard
              title="In Progress"
              value={loading ? "—" : inProgressCount}
              description="Currently being handled"
              icon={Clock3}
              iconStyle="bg-amber-50 text-amber-600"
            />

            <StatCard
              title="Resolved"
              value={loading ? "—" : resolvedCount}
              description="Successfully completed"
              icon={CheckCircle2}
              iconStyle="bg-emerald-50 text-emerald-600"
            />
          </div>
        </section>

        {/* Recent inquiries */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5 sm:px-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Recent Inquiries
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Five most recently created inquiries.
              </p>
            </div>

            <div className="hidden rounded-xl bg-amber-50 p-3 text-amber-600 sm:block">
              <ArrowUpRight size={21} />
            </div>
          </div>

          {loading ? (
            <div className="space-y-4 p-6">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-14 animate-pulse rounded-lg bg-slate-100"
                />
              ))}
            </div>
          ) : error ? (
            <div className="p-10 text-center">
              <CircleAlert size={30} className="mx-auto text-red-400" />
              <p className="mt-3 text-sm text-slate-500">
                Inquiry data could not be loaded.
              </p>
            </div>
          ) : recentInquiries.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <ClipboardList size={28} />
              </div>

              <h4 className="mt-4 text-base font-bold text-slate-900">
                No inquiries yet
              </h4>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Customer inquiries will appear here once they have been created.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Status
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Created
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {recentInquiries.map((inquiry) => (
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile inquiry cards */}
              <div className="divide-y divide-slate-100 md:hidden">
                {recentInquiries.map((inquiry) => (
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
                  </div>
                ))}
              </div>
            </>
          )}

          {!loading && !error && inquiries.length > 5 && (
            <div className="border-t border-slate-100 px-6 py-3">
              <p className="text-xs text-slate-500">
                Showing 5 of {inquiries.length} inquiries.
              </p>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}