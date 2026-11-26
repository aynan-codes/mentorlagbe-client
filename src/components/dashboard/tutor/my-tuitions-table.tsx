"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  Edit,
  Loader2,
  MapPin,
  Plus,
  Power,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import {
  deleteTuition,
  getMyTuitions,
  updateTuitionStatus,
} from "@/services/tuition.service";

import type { Tuition } from "@/types/tuition.types";

export default function MyTuitionsTable() {
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadTuitions = useCallback(
    async (showSuccessToast = false) => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyTuitions();

        setTuitions(Array.isArray(data) ? data : []);

        if (showSuccessToast) {
          toast.success("Tuition posts refreshed successfully.");
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unable to load your tuition posts.";

        console.error("My Tuitions Error:", err);
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

  const handleDelete = async (tuition: Tuition) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${tuition.title}"?`
    );

    if (!confirmed) return;

    try {
      setProcessingId(tuition._id);

      await deleteTuition(tuition._id);

      setTuitions((previous) =>
        previous.filter((item) => item._id !== tuition._id)
      );

      toast.success("Tuition deleted successfully.");
    } catch (err) {
      console.error("Delete Tuition Error:", err);

      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to delete tuition."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleStatusChange = async (tuition: Tuition) => {
    try {
      setProcessingId(tuition._id);

      const newStatus = !tuition.isActive;

      await updateTuitionStatus(tuition._id, newStatus);

      setTuitions((previous) =>
        previous.map((item) =>
          item._id === tuition._id
            ? { ...item, isActive: newStatus }
            : item
        )
      );

      toast.success(
        newStatus
          ? "Tuition activated successfully."
          : "Tuition closed successfully."
      );
    } catch (err) {
      console.error("Update Tuition Status Error:", err);

      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to update tuition status."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const filteredTuitions = tuitions.filter((tuition) => {
    const query = search.toLowerCase();

    return (
      tuition.title.toLowerCase().includes(query) ||
      tuition.subject.toLowerCase().includes(query) ||
      tuition.classLevel.toLowerCase().includes(query) ||
      tuition.location.toLowerCase().includes(query)
    );
  });

  const getApprovalStyle = (status: Tuition["approvalStatus"]) => {
    switch (status) {
      case "approved":
        return "border border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400";

      case "rejected":
        return "border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400";

      default:
        return "border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center gap-3">
        <Loader2 className="h-7 w-7 animate-spin text-[#4169E1]" />
        <span className="text-sm text-slate-500 dark:text-slate-400">
          Loading your tuitions...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-white p-8 text-center dark:bg-[#111827]">
        <AlertCircle className="mx-auto h-10 w-10 text-red-500" />

        <h3 className="mt-3 font-semibold text-slate-900 dark:text-white">
          Unable to load tuitions
        </h3>

        <p className="mt-2 text-sm text-red-500">{error}</p>

        <button
          onClick={() => loadTuitions(true)}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#4169E1] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2748A5]"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Page Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            My Tuitions
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your created tuition listings, toggle availability, or make updates.
          </p>
        </div>

        <Link
          href="/dashboard/tutor/add-tuition"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#4169E1] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2748A5]"
        >
          <Plus className="h-4 w-4" />
          Post New Tuition
        </Link>
      </div>

      {/* Search and Refresh */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search tuition..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/10 dark:border-slate-700 dark:bg-[#111827] dark:text-white"
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <button
          onClick={() => loadTuitions(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-[#4169E1] hover:text-[#4169E1] dark:border-slate-700 dark:bg-[#111827] dark:text-slate-300"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Tuition Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#111827]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead className="bg-slate-100 dark:bg-[#192438]">
              <tr className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <th className="w-[46%] px-5 py-4">Tuition</th>
                <th className="px-4 py-4">Subject & Level</th>
                <th className="px-4 py-4">Monthly Fee</th>
                <th className="px-4 py-4">Approval Status</th>
                <th className="px-4 py-4">Active Status</th>
                <th className="px-4 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/80">
              {filteredTuitions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[#E0EAFF] dark:bg-[#4169E1]/15">
                      <BookOpen className="h-7 w-7 text-[#4169E1]" />
                    </div>

                    <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
                      {search
                        ? "No matching tuitions found"
                        : "No tuition posts yet"}
                    </h3>

                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      {search
                        ? "Try searching with a different keyword."
                        : "Create your first tuition post to get started."}
                    </p>

                    {!search && (
                      <Link
                        href="/dashboard/tutor/add-tuition"
                        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#4169E1] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2748A5]"
                      >
                        <Plus className="h-4 w-4" />
                        Post New Tuition
                      </Link>
                    )}
                  </td>
                </tr>
              ) : (
                filteredTuitions.map((tuition) => {
                  const isProcessing = processingId === tuition._id;

                  return (
                    <tr
                      key={tuition._id}
                      className="transition-colors hover:bg-slate-50 dark:hover:bg-[#192438]/60"
                    >
                      {/* Tuition Details */}
                      <td className="px-5 py-3.5">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                            {tuition.bannerImage ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={tuition.bannerImage}
                                alt={tuition.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <BookOpen className="h-5 w-5 text-[#4169E1]" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p
                              title={tuition.title}
                              className="max-w-[300px] truncate text-sm font-semibold text-slate-800 dark:text-slate-100"
                            >
                              {tuition.title}
                            </p>

                            <p className="mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                              <MapPin className="h-3 w-3 shrink-0 text-[#4169E1]" />
                              <span className="truncate">
                                {tuition.location || "Online"}
                              </span>
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Subject & Level */}
                      <td className="px-4 py-3.5">
                        <div className="max-w-[130px]">
                          <span className="inline-block max-w-full truncate rounded-md bg-[#E0EAFF] px-2 py-1 text-xs font-semibold text-[#2748A5] dark:bg-[#4169E1]/15 dark:text-blue-300">
                            {tuition.subject}
                          </span>

                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Class {tuition.classLevel}
                          </p>
                        </div>
                      </td>

                      {/* Monthly Fee */}
                      <td className="whitespace-nowrap px-4 py-3.5 text-sm font-bold text-slate-800 dark:text-slate-100">
                        ৳
                        {Number(tuition.monthlyFee || 0).toLocaleString(
                          "en-BD"
                        )}
                      </td>

                      {/* Approval Status */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${getApprovalStyle(
                            tuition.approvalStatus
                          )}`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {tuition.approvalStatus}
                        </span>
                      </td>

                      {/* Active Status */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                            tuition.isActive
                              ? "border-[#4169E1]/20 bg-[#4169E1]/10 text-[#4169E1] dark:text-blue-300"
                              : "border-slate-300 bg-slate-100 text-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400"
                          }`}
                        >
                          <Power className="h-3 w-3" />
                          {tuition.isActive ? "Active" : "Closed"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleStatusChange(tuition)}
                            disabled={
                              isProcessing ||
                              tuition.approvalStatus !== "approved"
                            }
                            title={
                              tuition.approvalStatus !== "approved"
                                ? "Only approved tuitions can be activated or closed."
                                : tuition.isActive
                                  ? "Close tuition"
                                  : "Activate tuition"
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-[#4169E1] hover:bg-[#E0EAFF] hover:text-[#4169E1] disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-[#4169E1]/15"
                          >
                            {isProcessing ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Power className="h-4 w-4" />
                            )}
                          </button>

                          <Link
                            href={`/dashboard/tutor/edit-tuition/${tuition._id}`}
                            title="Edit tuition"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-[#4169E1] hover:bg-[#E0EAFF] hover:text-[#4169E1] dark:border-slate-700 dark:text-slate-400 dark:hover:bg-[#4169E1]/15"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>

                          <button
                            onClick={() => handleDelete(tuition)}
                            disabled={isProcessing}
                            title="Delete tuition"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-red-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-40 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {filteredTuitions.length > 0 && (
          <div className="border-t border-slate-200 bg-slate-50 px-5 py-3 dark:border-slate-700 dark:bg-[#192438]">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing {filteredTuitions.length} of {tuitions.length} tuition posts
            </p>
          </div>
        )}
      </div>
    </div>
  );
}