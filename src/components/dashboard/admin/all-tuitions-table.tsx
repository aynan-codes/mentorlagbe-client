"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Loader2,
  BookOpen,
  MapPin,
  GraduationCap,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import {
  getAllTuitions,
  updateTuitionApproval,
  type AdminTuition,
} from "@/services/admin.service";

type ApprovalAction = "approved" | "rejected";

export default function AllTuitionsTable() {
  const [tuitions, setTuitions] = useState<AdminTuition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingTuitionId, setUpdatingTuitionId] = useState<string | null>(
    null
  );

  // Load All Tuitions
  const loadTuitions = useCallback(
    async (showSuccessToast = false) => {
      try {
        setLoading(true);
        setError("");

        const data = await getAllTuitions();
        setTuitions(data);

        if (showSuccessToast) {
          toast.success("Tuitions refreshed successfully.");
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load tuitions.";

        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    void loadTuitions();
  }, [loadTuitions]);

  // Approve or Reject Tuition
  const handleApprovalChange = async (
    tuition: AdminTuition,
    newStatus: ApprovalAction
  ) => {
    if (updatingTuitionId) return;

    const actionText = newStatus === "approved" ? "approve" : "reject";

    const confirmed = window.confirm(
      `Are you sure you want to ${actionText} this tuition?`
    );

    if (!confirmed) return;

    try {
      setUpdatingTuitionId(tuition._id);

      await updateTuitionApproval(tuition._id, newStatus);

      setTuitions((currentTuitions) =>
        currentTuitions.map((item) =>
          item._id === tuition._id
            ? { ...item, approvalStatus: newStatus }
            : item
        )
      );

      toast.success(
        newStatus === "approved"
          ? "Tuition approved successfully."
          : "Tuition rejected successfully."
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to update tuition status.";

      toast.error(message);
    } finally {
      setUpdatingTuitionId(null);
    }
  };

  // Search and Status Filtering
  const filteredTuitions = useMemo(() => {
    return tuitions.filter((tuition) => {
      const searchValue = search.trim().toLowerCase();

      const matchesSearch =
        (tuition.title || "").toLowerCase().includes(searchValue) ||
        (tuition.subject || "").toLowerCase().includes(searchValue) ||
        (tuition.tutorName || "").toLowerCase().includes(searchValue) ||
        (tuition.tutorEmail || "").toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        tuition.approvalStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tuitions, search, statusFilter]);

  // Approval Status Style
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";

      case "rejected":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";

      default:
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
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
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#4169E1]" />

        <span className="ml-3 text-sm text-slate-500">
          Loading tuitions...
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
          onClick={() => loadTuitions()}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#4169E1] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2748A5]"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard title="Total Tuitions" value={tuitions.length} />

        <SummaryCard
          title="Approved"
          value={
            tuitions.filter((item) => item.approvalStatus === "approved")
              .length
          }
        />

        <SummaryCard
          title="Pending"
          value={
            tuitions.filter((item) => item.approvalStatus === "pending")
              .length
          }
        />

        <SummaryCard
          title="Rejected"
          value={
            tuitions.filter((item) => item.approvalStatus === "rejected")
              .length
          }
        />
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title, subject or tutor..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#4169E1] dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#4169E1] dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <button
          onClick={() => loadTuitions(true)}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#4169E1] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#2748A5]"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Tuition Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 p-5 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            All Tuitions
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Showing {filteredTuitions.length} of {tuitions.length} tuitions
          </p>
        </div>

        {filteredTuitions.length === 0 ? (
          <div className="px-4 py-16 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-slate-400" />

            <p className="mt-3 font-medium text-slate-700 dark:text-slate-300">
              No tuitions found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-4">Tuition</th>
                  <th className="px-5 py-4">Tutor</th>
                  <th className="px-5 py-4">Monthly Fee</th>
                  <th className="px-5 py-4">Approval</th>
                  <th className="px-5 py-4">Availability</th>
                  <th className="px-5 py-4">Created</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTuitions.map((tuition) => {
                  const isUpdating = updatingTuitionId === tuition._id;

                  return (
                    <tr
                      key={tuition._id}
                      className="transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      {/* Tuition Information */}
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {tuition.title}
                        </p>

                        <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                          <BookOpen className="h-3 w-3" />
                          {tuition.subject}
                        </p>

                        <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                          <GraduationCap className="h-3 w-3" />
                          Class {tuition.classLevel}
                        </p>

                        <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                          <MapPin className="h-3 w-3" />
                          {tuition.location || "N/A"}
                        </p>
                      </td>

                      {/* Tutor Information */}
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-800 dark:text-slate-200">
                          {tuition.tutorName}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {tuition.tutorEmail}
                        </p>
                      </td>

                      {/* Monthly Fee */}
                      <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-800 dark:text-slate-200">
                        ৳{tuition.monthlyFee.toLocaleString("en-BD")}
                      </td>

                      {/* Approval Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                            tuition.approvalStatus
                          )}`}
                        >
                          {tuition.approvalStatus}
                        </span>
                      </td>

                      {/* Availability */}
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            tuition.isActive
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                          }`}
                        >
                          {tuition.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Created Date */}
                      <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500 dark:text-slate-400">
                        {formatDate(tuition.createdAt)}
                      </td>

                      {/* Approval Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {tuition.approvalStatus !== "approved" && (
                            <button
                              type="button"
                              disabled={updatingTuitionId !== null}
                              onClick={() =>
                                handleApprovalChange(tuition, "approved")
                              }
                              className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isUpdating ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              )}
                              Approve
                            </button>
                          )}

                          {tuition.approvalStatus !== "rejected" && (
                            <button
                              type="button"
                              disabled={updatingTuitionId !== null}
                              onClick={() =>
                                handleApprovalChange(tuition, "rejected")
                              }
                              className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isUpdating ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <XCircle className="h-3.5 w-3.5" />
                              )}
                              Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Summary Card
function SummaryCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {title}
      </p>

      <p className="mt-3 text-3xl font-bold text-[#4169E1]">
        {value}
      </p>
    </div>
  );
}