"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  CalendarDays,
  Wallet,
  RefreshCw,
  Trash2,
  Search,
  BookOpen,
  User,
} from "lucide-react";
import { toast } from "sonner";

import {
  getMyApplications,
  cancelApplication,
  type Application,
} from "@/services/application.service";

const statusStyles = {
  pending:
    "border-amber-500/20 bg-amber-500/10 text-amber-400",
  accepted:
    "border-green-500/20 bg-green-500/10 text-green-400",
  rejected:
    "border-red-500/20 bg-red-500/10 text-red-400",
};

const statusLabels = {
  pending: "Pending",
  accepted: "Approved",
  rejected: "Rejected",
};

export default function ApplicationTable() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  const fetchApplications = useCallback(
    async (showSuccessToast = false) => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyApplications();

        setApplications(Array.isArray(data) ? data : []);

        if (showSuccessToast) {
          toast.success("Applications refreshed successfully.");
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to load your applications.";

        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    void fetchApplications();
  }, [fetchApplications]);

  const pendingCount = applications.filter(
    (application) => application.status === "pending"
  ).length;

  const approvedCount = applications.filter(
    (application) => application.status === "accepted"
  ).length;

  const rejectedCount = applications.filter(
    (application) => application.status === "rejected"
  ).length;

  const handleCancel = async (applicationId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this application?"
    );

    if (!confirmed) return;

    try {
      setCancelingId(applicationId);

      await cancelApplication(applicationId);

      setApplications((previous) =>
        previous.filter(
          (application) => application._id !== applicationId
        )
      );

      toast.success("Application cancelled successfully.");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to cancel application.";

      setError(message);
      toast.error(message);
    } finally {
      setCancelingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            My Applications
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            View and track all your tuition applications.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchApplications(true)}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#4169E1] hover:text-[#4169E1] disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-[#172033] dark:text-slate-200 dark:hover:border-[#4169E1] dark:hover:text-blue-400"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <SummaryCard
          title="Total Applications"
          count={applications.length}
          icon={<FileText size={20} />}
        />

        <SummaryCard
          title="Pending"
          count={pendingCount}
          icon={<Clock size={20} />}
        />

        <SummaryCard
          title="Approved"
          count={approvedCount}
          icon={<CheckCircle2 size={20} />}
        />

        <SummaryCard
          title="Rejected"
          count={rejectedCount}
          icon={<XCircle size={20} />}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="flex flex-col justify-between gap-3 rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-500 sm:flex-row sm:items-center">
          <p>{error}</p>

          <button
            type="button"
            onClick={() => fetchApplications(true)}
            disabled={loading}
            className="font-semibold underline disabled:opacity-50"
          >
            Try again
          </button>
        </div>
      )}

      {/* Applications Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#111827]">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-5 dark:border-slate-800 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              All Applications
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Track your application status and tuition details.
            </p>
          </div>

          <span className="w-fit rounded-lg bg-[#4169E1]/10 px-3 py-2 text-xs font-bold text-[#4169E1]">
            {applications.length} Applications
          </span>
        </div>

        {loading ? (
          <div className="flex min-h-64 flex-col items-center justify-center">
            <Loader2
              size={32}
              className="animate-spin text-[#4169E1]"
            />

            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Loading applications...
            </p>
          </div>
        ) : applications.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[#4169E1]/10 text-[#4169E1]">
              <FileText size={26} />
            </div>

            <h3 className="mt-4 font-bold text-slate-900 dark:text-white">
              No Applications Found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              You haven&apos;t applied for any tuition yet. Browse available
              tuition posts and submit your first application.
            </p>

            <Link
              href="/tuitions"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#4169E1] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2748A5]"
            >
              <Search size={16} />
              Explore Tuitions
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-[#172033]">
                  <tr className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="px-5 py-4">Tuition</th>
                    <th className="px-5 py-4">Tutor</th>
                    <th className="px-5 py-4">Schedule</th>
                    <th className="px-5 py-4">Monthly Fee</th>
                    <th className="px-5 py-4">Applied On</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {applications.map((application) => {
                    const isCanceling =
                      cancelingId === application._id;

                    return (
                      <tr
                        key={application._id}
                        className="transition hover:bg-slate-50 dark:hover:bg-[#172033]/70"
                      >
                        <td className="px-5 py-4">
                          <p className="max-w-[190px] truncate text-sm font-semibold text-slate-800 dark:text-white">
                            {application.tuitionTitle || "Tuition"}
                          </p>

                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {application.subject || "Not specified"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#4169E1]/10 text-[#4169E1]">
                              <User size={15} />
                            </div>

                            <span className="max-w-[170px] truncate text-xs text-slate-600 dark:text-slate-300">
                              {application.tutorEmail || "Not available"}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <p className="max-w-[150px] text-sm text-slate-600 dark:text-slate-300">
                            {application.preferredSchedule || "Not specified"}
                          </p>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          <span className="text-sm font-bold text-slate-800 dark:text-white">
                            ৳{Number(application.monthlyFee || 0).toLocaleString("en-BD")}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500 dark:text-slate-400">
                          {application.appliedAt
                            ? new Date(
                                application.appliedAt
                              ).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "N/A"}
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge status={application.status} />
                        </td>

                        <td className="px-5 py-4 text-right">
                          {application.status === "pending" ? (
                            <button
                              type="button"
                              onClick={() => handleCancel(application._id)}
                              disabled={isCanceling}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-500/10 disabled:opacity-50"
                            >
                              {isCanceling ? (
                                <Loader2
                                  size={14}
                                  className="animate-spin"
                                />
                              ) : (
                                <Trash2 size={14} />
                              )}
                              Cancel
                            </button>
                          ) : (
                            <span className="text-xs text-slate-500">
                              No action
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="grid gap-4 p-4 lg:hidden">
              {applications.map((application) => {
                const isCanceling =
                  cancelingId === application._id;

                return (
                  <div
                    key={application._id}
                    className="rounded-xl border border-slate-200 p-4 dark:border-slate-700 dark:bg-[#172033]/50"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {application.tuitionTitle || "Tuition"}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {application.subject || "Not specified"}
                        </p>
                      </div>

                      <StatusBadge status={application.status} />
                    </div>

                    <div className="mt-4 space-y-3 border-t border-slate-100 pt-4 dark:border-slate-700">
                      <DetailItem
                        icon={<User size={15} />}
                        label="Tutor"
                        value={application.tutorEmail || "Not available"}
                      />

                      <DetailItem
                        icon={<CalendarDays size={15} />}
                        label="Preferred Schedule"
                        value={application.preferredSchedule || "Not specified"}
                      />

                      <DetailItem
                        icon={<CalendarDays size={15} />}
                        label="Applied On"
                        value={
                          application.appliedAt
                            ? new Date(
                                application.appliedAt
                              ).toLocaleDateString("en-GB")
                            : "N/A"
                        }
                      />

                      <DetailItem
                        icon={<Wallet size={15} />}
                        label="Monthly Fee"
                        value={`৳${Number(application.monthlyFee || 0).toLocaleString("en-BD")}`}
                      />
                    </div>

                    {application.studentNote && (
                      <div className="mt-4 rounded-lg bg-slate-50 p-3 dark:bg-[#111827]">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          Your Learning Note
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                          {application.studentNote}
                        </p>
                      </div>
                    )}

                    {application.status === "pending" && (
                      <button
                        type="button"
                        onClick={() => handleCancel(application._id)}
                        disabled={isCanceling}
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/20 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-500/10 disabled:opacity-50"
                      >
                        {isCanceling ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                        Cancel Application
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  count,
  icon,
}: {
  title: string;
  count: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#111827] sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
          {title}
        </p>

        <div className="rounded-lg bg-[#4169E1]/10 p-2.5 text-[#4169E1]">
          {icon}
        </div>
      </div>

      <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
        {count}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: Application["status"];
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
        statusStyles[status]
      }`}
    >
      {statusLabels[status]}
    </span>
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
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 shrink-0 text-[#4169E1]">{icon}</span>

      <div className="min-w-0">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {label}
        </p>

        <p className="mt-0.5 break-words text-sm font-medium text-slate-800 dark:text-slate-200">
          {value}
        </p>
      </div>
    </div>
  );
}