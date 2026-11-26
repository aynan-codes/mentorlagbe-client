"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Check,
  X,
  Clock,
  RefreshCw,
  Users,
  BookOpen,
  CalendarDays,
  Phone,
  Mail,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";

import {
  getTutorApplications,
  updateApplicationStatus,
  type Application,
} from "@/services/application.service";

type FilterStatus = "all" | "pending" | "accepted" | "rejected";

const statusStyles = {
  pending:
    "bg-amber-500/10 text-amber-400 border-amber-500/20",
  accepted:
    "bg-green-500/10 text-green-400 border-green-500/20",
  rejected:
    "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function ApplicantTable() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchApplications = useCallback(
    async (showSuccessToast = false) => {
      try {
        setLoading(true);
        setError("");

        const data = await getTutorApplications();

        setApplications(Array.isArray(data) ? data : []);

        if (showSuccessToast) {
          toast.success("Applications refreshed successfully.");
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to load applications.";

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

  const handleStatusUpdate = async (
    applicationId: string,
    status: "accepted" | "rejected"
  ) => {
    const action = status === "accepted" ? "accept" : "reject";

    if (
      !window.confirm(
        `Are you sure you want to ${action} this application?`
      )
    ) {
      return;
    }

    try {
      setUpdatingId(applicationId);

      const updatedApplication = await updateApplicationStatus(
        applicationId,
        status
      );

      setApplications((previous) =>
        previous.map((application) =>
          application._id === applicationId
            ? { ...application, ...updatedApplication }
            : application
        )
      );

      toast.success(
        status === "accepted"
          ? "Application accepted successfully."
          : "Application rejected successfully."
      );
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to update application status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const pendingCount = applications.filter(
    (application) => application.status === "pending"
  ).length;

  const acceptedCount = applications.filter(
    (application) => application.status === "accepted"
  ).length;

  const rejectedCount = applications.filter(
    (application) => application.status === "rejected"
  ).length;

  const filteredApplications =
    filter === "all"
      ? applications
      : applications.filter(
          (application) => application.status === filter
        );

  const filters: {
    label: string;
    value: FilterStatus;
    count: number;
  }[] = [
    { label: "All Applications", value: "all", count: applications.length },
    { label: "Pending", value: "pending", count: pendingCount },
    { label: "Accepted", value: "accepted", count: acceptedCount },
    { label: "Rejected", value: "rejected", count: rejectedCount },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Applicants
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Review student applications and manage their status.
          </p>
        </div>

        <button
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
          icon={<Users size={20} />}
        />
        <SummaryCard
          title="Pending"
          count={pendingCount}
          icon={<Clock size={20} />}
        />
        <SummaryCard
          title="Accepted"
          count={acceptedCount}
          icon={<Check size={20} />}
        />
        <SummaryCard
          title="Rejected"
          count={rejectedCount}
          icon={<X size={20} />}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="flex flex-col justify-between gap-3 rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-500 sm:flex-row sm:items-center">
          <p>{error}</p>
          <button
            onClick={() => fetchApplications(true)}
            disabled={loading}
            className="font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Applications Table Card */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#111827]">
        {/* Table Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 p-5 dark:border-slate-800 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Student Applications
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage and review students who applied to your tuitions.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value)}
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  filter === item.value
                    ? "bg-[#4169E1] text-white"
                    : "border border-slate-200 bg-slate-50 text-slate-600 hover:border-[#4169E1] hover:text-[#4169E1] dark:border-slate-700 dark:bg-[#172033] dark:text-slate-300 dark:hover:text-blue-400"
                }`}
              >
                {item.label} ({item.count})
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <Loader2
              size={32}
              className="animate-spin text-[#4169E1]"
            />
          </div>
        ) : filteredApplications.length === 0 ? (
          /* Empty State */
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[#4169E1]/10 text-[#4169E1]">
              <Users size={26} />
            </div>

            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
              {applications.length === 0
                ? "No applications yet"
                : "No applications found"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
              {applications.length === 0
                ? "Student applications will appear here when someone applies to your tuition posts."
                : "There are no applications with the selected status."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-[#172033]">
                  <tr className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="px-5 py-4">Student</th>
                    <th className="px-5 py-4">Tuition</th>
                    <th className="px-5 py-4">Schedule</th>
                    <th className="px-5 py-4">Monthly Fee</th>
                    <th className="px-5 py-4">Applied On</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredApplications.map((application) => {
                    const isUpdating =
                      updatingId === application._id;

                    return (
                      <tr
                        key={application._id}
                        className="transition hover:bg-slate-50 dark:hover:bg-[#172033]/70"
                      >
                        {/* Student */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#4169E1]/10 text-sm font-bold text-[#4169E1]">
                              {(application.studentName || "S")
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div className="min-w-0">
                              <p className="font-semibold text-slate-800 dark:text-white">
                                {application.studentName || "Student"}
                              </p>
                              <p className="mt-1 max-w-[180px] truncate text-xs text-slate-500 dark:text-slate-400">
                                {application.studentEmail}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Tuition */}
                        <td className="px-5 py-4">
                          <p className="max-w-[180px] truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                            {application.tuitionTitle || "Tuition"}
                          </p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {application.subject}
                          </p>
                        </td>

                        {/* Schedule */}
                        <td className="px-5 py-4">
                          <p className="max-w-[150px] text-sm text-slate-600 dark:text-slate-300">
                            {application.preferredSchedule || "Not provided"}
                          </p>
                        </td>

                        {/* Fee */}
                        <td className="whitespace-nowrap px-5 py-4">
                          <span className="text-sm font-bold text-slate-800 dark:text-white">
                            ৳{application.monthlyFee?.toLocaleString("en-BD") ?? 0}
                          </span>
                        </td>

                        {/* Date */}
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

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
                              statusStyles[application.status]
                            }`}
                          >
                            {application.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          {application.status === "pending" ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() =>
                                  handleStatusUpdate(
                                    application._id,
                                    "accepted"
                                  )
                                }
                                disabled={isUpdating}
                                title="Accept application"
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#4169E1] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#2748A5] disabled:opacity-50"
                              >
                                {isUpdating ? (
                                  <Loader2 size={14} className="animate-spin" />
                                ) : (
                                  <Check size={14} />
                                )}
                                Accept
                              </button>

                              <button
                                onClick={() =>
                                  handleStatusUpdate(
                                    application._id,
                                    "rejected"
                                  )
                                }
                                disabled={isUpdating}
                                title="Reject application"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-500/10 disabled:opacity-50"
                              >
                                <X size={14} />
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="block text-right text-xs text-slate-500 dark:text-slate-500">
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

            {/* Mobile / Tablet Cards */}
            <div className="grid gap-4 p-4 lg:hidden">
              {filteredApplications.map((application) => {
                const isUpdating =
                  updatingId === application._id;

                return (
                  <div
                    key={application._id}
                    className="rounded-xl border border-slate-200 p-4 dark:border-slate-700 dark:bg-[#172033]/50"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#4169E1]/10 font-bold text-[#4169E1]">
                          {(application.studentName || "S")
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {application.studentName || "Student"}
                          </p>
                          <p className="max-w-[190px] truncate text-xs text-slate-500 dark:text-slate-400">
                            {application.studentEmail}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
                          statusStyles[application.status]
                        }`}
                      >
                        {application.status}
                      </span>
                    </div>

                    <div className="mt-4 space-y-3 border-t border-slate-100 pt-4 dark:border-slate-700">
                      <DetailItem
                        icon={<BookOpen size={15} />}
                        label="Tuition"
                        value={`${application.tuitionTitle || "Tuition"} · ${application.subject}`}
                      />

                      <DetailItem
                        icon={<CalendarDays size={15} />}
                        label="Schedule"
                        value={application.preferredSchedule || "Not provided"}
                      />

                      <DetailItem
                        icon={<Phone size={15} />}
                        label="Phone"
                        value={application.studentPhone || "Not provided"}
                      />

                      <DetailItem
                        icon={<Mail size={15} />}
                        label="Email"
                        value={application.studentEmail}
                      />

                      <DetailItem
                        icon={<Clock size={15} />}
                        label="Applied"
                        value={
                          application.appliedAt
                            ? new Date(
                                application.appliedAt
                              ).toLocaleDateString("en-GB")
                            : "N/A"
                        }
                      />

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                          Monthly Fee
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          ৳{application.monthlyFee?.toLocaleString("en-BD") ?? 0}
                        </span>
                      </div>
                    </div>

                    {application.studentNote && (
                      <div className="mt-4 rounded-lg bg-slate-50 p-3 dark:bg-[#111827]">
                        <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                          <MessageSquare size={14} />
                          Student&apos;s Note
                        </div>
                        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                          {application.studentNote}
                        </p>
                      </div>
                    )}

                    {application.status === "pending" && (
                      <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4 dark:border-slate-700">
                        <button
                          onClick={() =>
                            handleStatusUpdate(
                              application._id,
                              "rejected"
                            )
                          }
                          disabled={isUpdating}
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-500/20 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-500/10 disabled:opacity-50"
                        >
                          <X size={16} />
                          Reject
                        </button>

                        <button
                          onClick={() =>
                            handleStatusUpdate(
                              application._id,
                              "accepted"
                            )
                          }
                          disabled={isUpdating}
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#4169E1] py-2.5 text-sm font-semibold text-white hover:bg-[#2748A5] disabled:opacity-50"
                        >
                          {isUpdating ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Check size={16} />
                          )}
                          Accept
                        </button>
                      </div>
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