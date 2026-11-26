"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Check,
  X,
  Loader2,
  RefreshCw,
  AlertCircle,
  MapPin,
  CalendarDays,
  BookOpen,
  Search,
} from "lucide-react";
import { toast } from "sonner";

import {
  getPendingTuitions,
  updateTuitionApproval,
  type AdminTuition,
} from "@/services/admin.service";

export default function PendingTuitionTable() {
  const [tuitions, setTuitions] = useState<AdminTuition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Load Pending Tuitions
  const loadTuitions = useCallback(
    async (showSuccessToast = false) => {
      try {
        setLoading(true);
        setError("");

        const data = await getPendingTuitions();
        setTuitions(data);

        if (showSuccessToast) {
          toast.success("Pending tuitions refreshed successfully.");
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to load pending tuitions.";

        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadTuitions();
  }, [loadTuitions]);

  // Search Pending Tuitions
  const filteredTuitions = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    if (!searchTerm) return tuitions;

    return tuitions.filter((tuition) => {
      return (
        tuition.title?.toLowerCase().includes(searchTerm) ||
        tuition.subject?.toLowerCase().includes(searchTerm) ||
        tuition.tutorName?.toLowerCase().includes(searchTerm) ||
        tuition.tutorEmail?.toLowerCase().includes(searchTerm) ||
        tuition.location?.toLowerCase().includes(searchTerm) ||
        tuition.classLevel?.toLowerCase().includes(searchTerm)
      );
    });
  }, [tuitions, search]);

  // Handle Approval
  const handleApproval = async (
    id: string,
    status: "approved" | "rejected",
  ) => {
    try {
      setProcessingId(id);

      const message = await updateTuitionApproval(id, status);

      toast.success(message || `Tuition ${status} successfully.`);

      setTuitions((previous) =>
        previous.filter((tuition) => tuition._id !== id),
      );
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Unable to update tuition status.",
      );
    } finally {
      setProcessingId(null);
    }
  };

  // Format Date
  const formatDate = (date: string) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString("en-BD", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex min-h-60 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#4169E1]" />
        <span className="ml-3 text-sm text-slate-500">
          Loading pending tuitions...
        </span>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/30">
        <AlertCircle className="mx-auto h-8 w-8 text-red-500" />

        <p className="mt-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>

        <button
          onClick={() => void loadTuitions()}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#4169E1] px-4 py-2 text-sm font-medium text-white hover:bg-[#2748A5]"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section className="space-y-7">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Pending Tuition Requests
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Review and manage tuition approval requests.
          </p>
        </div>

        <button
          onClick={() => void loadTuitions(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Summary Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <BookOpen className="h-6 w-6 text-[#4169E1]" />

        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Total Pending Requests
        </p>

        <p className="mt-1 text-3xl font-bold text-[#4169E1]">
          {tuitions.length}
        </p>
      </div>

      {/* Search */}
      {tuitions.length > 0 && (
        <>
          <div className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <Search className="absolute left-7 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, subject, tutor, email or location..."
              className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Results Count */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Showing{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {filteredTuitions.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {tuitions.length}
              </span>{" "}
              pending requests
            </p>

            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-sm font-medium text-[#4169E1] hover:underline"
              >
                Clear Search
              </button>
            )}
          </div>
        </>
      )}

      {/* Tuition List */}
      {filteredTuitions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
          <BookOpen className="mx-auto h-12 w-12 text-slate-400" />

          <h3 className="mt-4 text-lg font-semibold text-slate-800 dark:text-white">
            {tuitions.length === 0
              ? "No Pending Tuitions"
              : "No Tuitions Found"}
          </h3>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {tuitions.length === 0
              ? "All tuition requests have been reviewed."
              : "Try changing your search keywords."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTuitions.map((tuition) => (
            <article
              key={tuition._id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              {/* Title and Status */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {tuition.title}
                  </h3>

                  <span className="mt-2 inline-block rounded-full bg-[#E0EAFF] px-3 py-1 text-xs font-semibold text-[#2748A5]">
                    {tuition.subject}
                  </span>
                </div>

                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  Pending
                </span>
              </div>

              {/* Tuition Information */}
              <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2 dark:text-slate-400">
                <p>
                  <span className="font-medium">Class:</span>{" "}
                  {tuition.classLevel}
                </p>

                <p>
                  <span className="font-medium">Tutor:</span>{" "}
                  {tuition.tutorName}
                </p>

                <p className="break-all">
                  <span className="font-medium">Email:</span>{" "}
                  {tuition.tutorEmail}
                </p>

                <p>
                  <span className="font-medium">Monthly Fee:</span>{" "}
                  ৳{tuition.monthlyFee}
                </p>

                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-[#4169E1]" />
                  {tuition.location}
                </p>

                <p className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 shrink-0 text-[#4169E1]" />
                  {formatDate(tuition.createdAt)}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                <button
                  onClick={() =>
                    void handleApproval(tuition._id, "rejected")
                  }
                  disabled={processingId !== null}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900 dark:hover:bg-red-950/30"
                >
                  {processingId === tuition._id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                  Reject
                </button>

                <button
                  onClick={() =>
                    void handleApproval(tuition._id, "approved")
                  }
                  disabled={processingId !== null}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#4169E1] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2748A5] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {processingId === tuition._id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  Approve
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}