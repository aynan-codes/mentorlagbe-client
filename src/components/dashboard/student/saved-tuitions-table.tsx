"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  Search,
  RefreshCw,
  Loader2,
  Trash2,
  ExternalLink,
  MapPin,
  CalendarDays,
  Wallet,
  Crown,
  BookOpen,
  GraduationCap,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

import {
  getMyBookmarks,
  removeBookmark,
} from "@/services/bookmark.service";
import { getMyProfile } from "@/services/user.service";
import type { Tuition } from "@/types/tuition.types";

const FREE_BOOKMARK_LIMIT = 5;

export default function SavedTuitionsTable() {
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [plan, setPlan] = useState<"free" | "pro">("free");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);

  const fetchData = useCallback(async (showToast = false) => {
    try {
      setError("");

      const [bookmarkResult, profileResult] = await Promise.allSettled([
        getMyBookmarks(),
        getMyProfile(),
      ]);

      if (bookmarkResult.status === "rejected") {
        throw bookmarkResult.reason;
      }

      setTuitions(
        Array.isArray(bookmarkResult.value)
          ? bookmarkResult.value
          : []
      );

      if (profileResult.status === "fulfilled") {
        setPlan(
          profileResult.value.plan === "pro" ? "pro" : "free"
        );
      }

      if (showToast) {
        toast.success("Saved tuitions refreshed.");
      }
    } catch (err) {
      console.error("Saved tuitions loading error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load saved tuitions."
      );

      if (showToast) {
        toast.error("Failed to refresh saved tuitions.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredTuitions = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    if (!searchTerm) return tuitions;

    return tuitions.filter((tuition) =>
      [
        tuition.title,
        tuition.subject,
        tuition.classLevel,
        tuition.location,
        tuition.tutorName,
      ]
        .filter(Boolean)
        .some((value) =>
          value.toLowerCase().includes(searchTerm)
        )
    );
  }, [tuitions, search]);

  const handleRemove = async (tuitionId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this saved tuition?"
    );

    if (!confirmed) return;

    try {
      setRemovingId(tuitionId);

      await removeBookmark(tuitionId);

      setTuitions((previous) =>
        previous.filter((tuition) => tuition._id !== tuitionId)
      );

      toast.success("Tuition removed from saved list.");
    } catch (err) {
      console.error("Bookmark removal error:", err);

      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to remove saved tuition."
      );
    } finally {
      setRemovingId(null);
    }
  };

  const isPro = plan === "pro";
  const usagePercentage = Math.min(
    (tuitions.length / FREE_BOOKMARK_LIMIT) * 100,
    100
  );

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#4169E1]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Bookmark className="h-6 w-6 text-[#4169E1]" />

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Saved Tuitions
            </h1>
          </div>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your bookmarked tuition opportunities.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchData(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Saved"
          value={tuitions.length}
          icon={<Bookmark size={20} />}
          description="Your bookmarked tuitions"
        />

        <SummaryCard
          title="Membership"
          value={isPro ? "Pro" : "Free"}
          icon={
            isPro ? (
              <Crown size={20} />
            ) : (
              <GraduationCap size={20} />
            )
          }
          description={isPro ? "Unlimited bookmarks" : "Free membership"}
        />

        <SummaryCard
          title="Bookmark Limit"
          value={isPro ? "Unlimited" : `${tuitions.length}/5`}
          icon={<BookOpen size={20} />}
          description={
            isPro ? "No bookmark limit" : "Maximum 5 saved tuitions"
          }
        />

        <SummaryCard
          title="Remaining"
          value={isPro ? "Unlimited" : Math.max(0, FREE_BOOKMARK_LIMIT - tuitions.length)}
          icon={<Bookmark size={20} />}
          description={
            isPro ? "Available without limits" : "Available bookmarks"
          }
        />
      </div>

      {/* Membership Information */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#4169E1]/10 text-[#4169E1]">
              {isPro ? <Crown size={22} /> : <Bookmark size={22} />}
            </div>

            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">
                {isPro ? "Pro Membership" : "Free Membership"}
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {isPro
                  ? "You can save unlimited tuition opportunities."
                  : `${tuitions.length} of ${FREE_BOOKMARK_LIMIT} bookmarks used.`}
              </p>
            </div>
          </div>

          {!isPro && (
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#4169E1] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2748A5]"
            >
              <Crown size={16} />
              Upgrade to Pro
            </Link>
          )}

          {isPro && (
            <span className="w-fit rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700 dark:bg-green-500/10 dark:text-green-400">
              Unlimited Bookmarks
            </span>
          )}
        </div>

        {!isPro && (
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">
                Bookmark usage
              </span>

              <span className="font-semibold text-[#4169E1]">
                {Math.round(usagePercentage)}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-[#4169E1] transition-all"
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/20 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
            <AlertCircle size={18} />
            {error}
          </div>

          <button
            type="button"
            onClick={() => fetchData(true)}
            className="w-fit rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Table Section */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">
              All Saved Tuitions
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {filteredTuitions.length} tuition(s) found
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search saved tuitions..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#4169E1] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        {!error && filteredTuitions.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#4169E1]/10">
              <Bookmark className="h-8 w-8 text-[#4169E1]" />
            </div>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {search ? "No Matching Tuitions" : "No Saved Tuitions Yet"}
            </h3>

            <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              {search
                ? "Try searching with a different keyword."
                : "Browse available tuition opportunities and save the ones you like."}
            </p>

            {!search && (
              <Link
                href="/tuitions"
                className="mt-5 rounded-lg bg-[#4169E1] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2748A5]"
              >
                Explore Tuitions
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/70">
                  <tr className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    <th className="px-5 py-4 font-semibold">Tuition</th>
                    <th className="px-5 py-4 font-semibold">Subject</th>
                    <th className="px-5 py-4 font-semibold">Class</th>
                    <th className="px-5 py-4 font-semibold">Location</th>
                    <th className="px-5 py-4 font-semibold">Monthly Fee</th>
                    <th className="px-5 py-4 font-semibold">Schedule</th>
                    <th className="px-5 py-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredTuitions.map((tuition) => (
                    <tr
                      key={tuition._id}
                      className="transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    >
                      <td className="px-5 py-4">
                        <div className="flex min-w-[220px] items-center gap-3">
                          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                            {tuition.bannerImage ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={tuition.bannerImage}
                                alt={tuition.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <BookOpen className="h-5 w-5 text-slate-400" />
                              </div>
                            )}
                          </div>

                          <div>
                            <p className="max-w-[200px] truncate text-sm font-semibold text-slate-900 dark:text-white">
                              {tuition.title}
                            </p>

                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              {tuition.tutorName}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
                        {tuition.subject}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
                        {tuition.classLevel}
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
                          <MapPin size={14} className="text-[#4169E1]" />
                          {tuition.location}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                        ৳{tuition.monthlyFee.toLocaleString("en-BD")}
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
                          <CalendarDays size={14} className="text-[#4169E1]" />
                          {tuition.daysPerWeek} days/week
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/tuitions/${tuition._id}`}
                            title="View tuition"
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#4169E1]/10 text-[#4169E1] transition hover:bg-[#4169E1] hover:text-white"
                          >
                            <ExternalLink size={16} />
                          </Link>

                          <button
                            type="button"
                            title="Remove bookmark"
                            disabled={removingId === tuition._id}
                            onClick={() => handleRemove(tuition._id)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-500/10 dark:text-red-400"
                          >
                            {removingId === tuition._id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile / Tablet Cards */}
            <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:hidden">
              {filteredTuitions.map((tuition) => (
                <div
                  key={tuition._id}
                  className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                      {tuition.bannerImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={tuition.bannerImage}
                          alt={tuition.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <BookOpen className="h-6 w-6 text-slate-400" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        {tuition.title}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {tuition.tutorName}
                      </p>

                      <span className="mt-2 inline-flex rounded-full bg-[#4169E1]/10 px-2.5 py-1 text-xs font-medium text-[#4169E1]">
                        {tuition.subject}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
                    <DetailItem
                      icon={<GraduationCap size={14} />}
                      label="Class"
                      value={tuition.classLevel}
                    />

                    <DetailItem
                      icon={<Wallet size={14} />}
                      label="Monthly Fee"
                      value={`৳${tuition.monthlyFee.toLocaleString("en-BD")}`}
                    />

                    <DetailItem
                      icon={<MapPin size={14} />}
                      label="Location"
                      value={tuition.location}
                    />

                    <DetailItem
                      icon={<CalendarDays size={14} />}
                      label="Days/Week"
                      value={`${tuition.daysPerWeek} days`}
                    />
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Link
                      href={`/tuitions/${tuition._id}`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#4169E1] px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-[#2748A5]"
                    >
                      <ExternalLink size={14} />
                      View Details
                    </Link>

                    <button
                      type="button"
                      disabled={removingId === tuition._id}
                      onClick={() => handleRemove(tuition._id)}
                      className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
                    >
                      {removingId === tuition._id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon,
  description,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {title}
        </p>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4169E1]/10 text-[#4169E1]">
          {icon}
        </div>
      </div>

      <h3 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
        {value}
      </h3>

      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-[#4169E1]">{icon}</span>

      <div className="min-w-0">
        <p className="text-[11px] text-slate-400">{label}</p>
        <p className="truncate text-xs font-medium text-slate-700 dark:text-slate-300">
          {value}
        </p>
      </div>
    </div>
  );
}