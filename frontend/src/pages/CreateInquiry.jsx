import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ClipboardList,
  UserRound,
  Mail,
  FileText,
  AlignLeft,
  Send,
  CircleAlert,
} from "lucide-react";
import api from "../api/api";
import Layout from "../components/Layout";

export default function CreateInquiry() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customerName: "",
    contact: "",
    subject: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      await api.post("/inquiries", {
        customerName: form.customerName.trim(),
        contact: form.contact.trim(),
        subject: form.subject.trim(),
        description: form.description.trim(),
      });

      navigate("/inquiries", {
        state: { message: "Inquiry created successfully." },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.message ||
          "Unable to create the inquiry. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-3xl space-y-6">
        <Link
          to="/inquiries"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-amber-600"
        >
          <ArrowLeft size={17} />
          Back to inquiries
        </Link>

        <section>
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">
            Customer Support
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Create New Inquiry
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Enter the customer's details and describe the issue or request.
          </p>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-4 border-b border-slate-200 bg-slate-50 px-6 py-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <ClipboardList size={24} />
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                Inquiry Information
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Fields marked with * are required.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-6 sm:p-8">
            {error && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                <CircleAlert size={19} className="mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div>
              <label
                htmlFor="customerName"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Customer Name *
              </label>

              <div className="relative">
                <UserRound
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="customerName"
                  name="customerName"
                  type="text"
                  value={form.customerName}
                  onChange={handleChange}
                  placeholder="Enter customer's full name"
                  required
                  maxLength={100}
                  className="w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="contact"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Contact Details *
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="contact"
                  name="contact"
                  type="text"
                  value={form.contact}
                  onChange={handleChange}
                  placeholder="Email address or phone number"
                  required
                  maxLength={254}
                  className="w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="subject"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Subject *
              </label>

              <div className="relative">
                <FileText
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Briefly describe the issue"
                  required
                  maxLength={200}
                  className="w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Description *
              </label>

              <div className="relative">
                <AlignLeft
                  size={18}
                  className="absolute left-4 top-4 text-slate-400"
                />

                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Provide details about the customer's inquiry..."
                  required
                  rows={5}
                  className="w-full resize-y rounded-xl border border-slate-200 py-3.5 pl-11 pr-4 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
                />
              </div>

              <p className="mt-2 text-xs text-slate-400">
                Include relevant details to help the support team understand
                the issue.
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
              <Link
                to="/inquiries"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send size={17} />
                {loading ? "Creating..." : "Create Inquiry"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </Layout>
  );
}