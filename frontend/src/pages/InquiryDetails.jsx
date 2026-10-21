import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ClipboardList,
  UserRound,
  Mail,
  FileText,
  CalendarDays,
  Clock3,
  CheckCircle2,
  RefreshCw,
  CircleAlert,
  Save,
} from "lucide-react";
import api from "../api/api";
import Layout from "../components/Layout";

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
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export default function InquiryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [inquiry, setInquiry] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchInquiry = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/inquiries/${id}`);
      const data = response.data.inquiry || response.data;

      setInquiry(data);
      setStatus(data.status || "NEW");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load this inquiry. It may not exist or you may not have access.",
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchInquiry();
  }, [fetchInquiry]);

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!inquiry || status === inquiry.status) {
      setSuccess("No status changes to save.");
      return;
    }

    try {
      setSaving(true);

      const response = await api.patch(`/inquiries/${id}/status`, {
        status,
      });

      const updated = response.data.inquiry || response.data;

      setInquiry((previous) => ({
        ...previous,
        ...updated,
        status: updated.status || status,
      }));

      setStatus(updated.status || status);
      setSuccess("Inquiry status updated successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update the inquiry status. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="mx-auto max-w-4xl animate-pulse space-y-6">
          <div className="h-5 w-36 rounded bg-slate-200" />
          <div className="h-10 w-72 rounded bg-slate-200" />
          <div className="h-64 rounded-2xl bg-slate-200" />
        </div>
      </Layout>
    );
  }

  if (error && !inquiry) {
    return (
      <Layout>
        <div className="mx-auto max-w-3xl">
          <Link
            to="/inquiries"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-amber-600"
          >
            <ArrowLeft size={17} />
            Back to inquiries
          </Link>

          <div className="mt-6 rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <CircleAlert size={34} className="mx-auto text-red-500" />
            <h2 className="mt-4 text-xl font-bold text-slate-900">
              Unable to open inquiry
            </h2>
            <p className="mt-2 text-sm text-slate-500">{error}</p>

            <button
              type="button"
              onClick={fetchInquiry}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-slate-950 hover:bg-amber-400"
            >
              <RefreshCw size={16} />
              Try again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-4xl space-y-6">
        <Link
          to="/inquiries"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-amber-600"
        >
          <ArrowLeft size={17} />
          Back to inquiries
        </Link>

        {/* Heading */}
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">
              Customer Support
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Inquiry Details
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Review the inquiry information and manage its status.
            </p>
          </div>

          <span
            className={`inline-flex w-fit items-center rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-inset ${
              statusStyles[inquiry.status] ||
              "bg-slate-100 text-slate-600 ring-slate-200"
            }`}
          >
            {statusLabels[inquiry.status] || inquiry.status}
          </span>
        </section>

        {/* Alerts */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <CircleAlert size={18} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
          >
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
            {success}
          </div>
        )}

        {/* Customer and inquiry information */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-4 border-b border-slate-200 bg-slate-50 px-6 py-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <ClipboardList size={24} />
            </div>

            <div className="min-w-0">
              <h3 className="text-lg font-bold text-slate-900">
                {inquiry.subject}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Inquiry ID: #{inquiry.id}
              </p>
            </div>
          </div>

          <div className="space-y-7 p-6 sm:p-8">
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                Customer Information
              </h4>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-slate-100 p-2.5 text-slate-600">
                    <UserRound size={19} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">Customer Name</p>
                    <p className="mt-1 break-words text-sm font-semibold text-slate-900">
                      {inquiry.customerName}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-slate-100 p-2.5 text-slate-600">
                    <Mail size={19} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">Contact Details</p>
                    <p className="mt-1 break-words text-sm font-semibold text-slate-900">
                      {inquiry.contact}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-7">
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                Staff Information
              </h4>

              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-amber-100 p-2.5 text-amber-700">
                  <UserRound size={19} />
                </div>

                <div>
                  <p className="text-xs text-slate-500">Created By</p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {inquiry.createdBy?.name || "Unknown Staff"}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Staff ID: {inquiry.createdBy?.id ?? inquiry.createdById}
                  </p>

                  {inquiry.createdBy?.email && (
                    <p className="mt-1 text-xs text-slate-500">
                      {inquiry.createdBy.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-7">
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                Inquiry Description
              </h4>

              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-slate-100 p-2.5 text-slate-600">
                  <FileText size={19} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">
                    {inquiry.description || "No description provided."}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 border-t border-slate-100 pt-7 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-slate-100 p-2.5 text-slate-600">
                  <CalendarDays size={19} />
                </div>

                <div>
                  <p className="text-xs text-slate-500">Created At</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {formatDate(inquiry.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-slate-100 p-2.5 text-slate-600">
                  <Clock3 size={19} />
                </div>

                <div>
                  <p className="text-xs text-slate-500">Last Updated</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {formatDate(inquiry.updatedAt || inquiry.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Status update */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900">
              Manage Inquiry Status
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Update the current status to reflect the inquiry's progress.
            </p>
          </div>

          <form
            onSubmit={handleStatusUpdate}
            className="flex flex-col gap-4 sm:flex-row sm:items-end"
          >
            <div className="flex-1">
              <label
                htmlFor="status"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Status
              </label>

              <select
                id="status"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setSuccess("");
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-700 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
              >
                <option value="NEW">New</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={saving || status === inquiry.status}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={17} />
              {saving ? "Saving..." : "Save Status"}
            </button>
          </form>
        </section>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate("/inquiries")}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back to Inquiries
          </button>
        </div>
      </div>
    </Layout>
  );
}
