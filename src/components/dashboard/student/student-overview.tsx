"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Crown,
  ArrowRight,
  BookOpen,
  Search,
  RefreshCw,
  Loader2,
  AlertCircle,
  GraduationCap,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

import { useSession } from "@/lib/auth-client";
import {
  getMyApplications,
  type Application,
} from "@/services/application.service";

const statStyles = [
  {
    title: "Total Applications",
    icon: FileText,
    iconBg: "bg-[#E0EAFF] dark:bg-[#4169E1]/20",
    iconColor: "text-[#4169E1]",
    valueColor: "text-slate-900 dark:text-white",
  },
  {
    title: "Pending Applications",
    icon: Clock,
    iconBg: "bg-amber-100 dark:bg-amber-500/10",
    iconColor: "text-amber-600 dark:text-amber-400",
    valueColor: "text-slate-900 dark:text-white",
  },
  {
    title: "Approved Applications",
    icon: CheckCircle2,
    iconBg: "bg-green-100 dark:bg-green-500/10",
    iconColor: "text-green-600 dark:text-green-400",
    valueColor: "text-slate-900 dark:text-white",
  },
  {
    title: "Rejected Applications",
    icon: XCircle,
    iconBg: "bg-red-100 dark:bg-red-500/10",
    iconColor: "text-red-600 dark:text-red-400",
    valueColor: "text-slate-900 dark:text-white",
  },
];

export default function StudentOverview() {
  const { data: session } = useSession();

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = session?.user as
    | {
        name?: string;
        plan?: string;
      }
    | undefined;

  const userName = user?.name || "Student";
  const currentPlan = user?.plan || "free";
  const isPro = currentPlan.toLowerCase() === "pro";

  const loadApplications = useCallback(
    async (showSuccessToast = false) => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyApplications();

        setApplications(Array.isArray(data) ? data : []);

        if (showSuccessToast) {
          toast.success("Dashboard refreshed successfully.");
        }
      } catch (err: unknown) {
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
    loadApplications();
  }, [loadApplications]);

  const totalApplications = applications.length;

  const pendingApplications = applications.filter(
    (application) => application.status === "pending"
  ).length;

  const acceptedApplications = applications.filter(
    (application) => application.status === "accepted"
  ).length;

  const rejectedApplications = applications.filter(
    (application) => application.status === "rejected"
  ).length;

  const stats = [
    totalApplications,
    pendingApplications,
    acceptedApplications,
    rejectedApplications,
  ];

  const formatDate = (date: string) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "N/A";

    return parsedDate.toLocaleDateString("en-BD", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusStyle = (status: Application["status"]) => {
    switch (status) {
      case "accepted":
        return "bg-green-50 text-green-700 ring-1 ring-green-200 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20";

      case "rejected":
        return "bg-red-50 text-red-700 ring-1 ring-red-200 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20";

      default:
        return "bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[350px] flex-col items-center justify-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E0EAFF] dark:bg-[#4169E1]/20">
          <Loader2 className="h-7 w-7 animate-spin text-[#4169E1]" />
        </div>

        <div className="text-center">
          <p className="font-semibold text-slate-800 dark:text-white">
            Loading Student Dashboard
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Please wait a moment...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[350px] items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm dark:border-red-900 dark:bg-slate-800">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-500/10">
            <AlertCircle className="h-7 w-7 text-red-500" />
          </div>

          <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
            Unable to load dashboard
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {error}
          </p>

          <button
            onClick={() => loadApplications(true)}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#4169E1] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2748A5]"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Welcome Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2748A5] to-[#4169E1] p-6 text-white shadow-lg sm:p-8">
        <div className="absolute -right-12 -top-16 h-56 w-56 rounded-full bg-white/10" />
        <div className="absolute -bottom-20 right-40 h-48 w-48 rounded-full bg-white/10" />

        <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-blue-50">
              <Sparkles className="h-3.5 w-3.5" />
              Student Dashboard
            </div>

            <h1 className="text-2xl font-bold sm:text-3xl">
              Welcome back, {userName}!
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
              Manage your tuition applications, track your progress and
              find the right tutor for your learning journey.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                href="/tuitions"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#2748A5] shadow-sm transition hover:bg-blue-50"
              >
                <Search className="h-4 w-4" />
                Explore Tuitions
              </Link>

              <Link
                href="/dashboard/student/applications"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                My Applications
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="hidden h-32 w-32 shrink-0 items-center justify-center rounded-3xl border border-white/20 bg-white/10 lg:flex">
            <GraduationCap className="h-20 w-20 text-white" />
          </div>
        </div>
      </section>

      {/* Statistics Header */}
      <section>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Application Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              A quick summary of your tuition applications.
            </p>
          </div>

          <button
            onClick={() => loadApplications(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-[#4169E1] hover:text-[#4169E1] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {statStyles.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#4169E1]/40 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 sm:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {stat.title}
                    </p>

                    <h3
                      className={`mt-3 text-3xl font-bold ${stat.valueColor}`}
                    >
                      {stats[index]}
                    </h3>
                  </div>

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconBg}`}
                  >
                    <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-400 dark:border-slate-700 dark:text-slate-500">
                  <TrendingUp className="h-3.5 w-3.5 text-[#4169E1]" />
                  <span>Your application activity</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Subscription Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2748A5] to-[#4169E1] p-6 text-white shadow-md sm:p-8">
        <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/10" />

        <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                <Crown className="h-5 w-5" />
              </div>

              <span className="text-sm font-semibold text-blue-100">
                Your Subscription
              </span>
            </div>

            <h2 className="text-2xl font-bold">
              {isPro ? "Pro Plan" : "Free Plan"}
            </h2>

            <p className="mt-2 max-w-lg text-sm leading-6 text-blue-100">
              {isPro
                ? "You are enjoying unlimited student bookmarks. Keep exploring tuition opportunities."
                : "Save up to 5 tuition opportunities with your Free Plan. Upgrade to unlock unlimited bookmarks."}
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium">
              <BookOpen className="h-4 w-4" />

              {isPro ? (
                <span>Unlimited Bookmarks</span>
              ) : (
                <span>Bookmark Limit: 5 Tuitions</span>
              )}
            </div>
          </div>

          {!isPro && (
            <Link
              href="/pricing"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#2748A5] shadow-sm transition hover:bg-blue-50"
            >
              <Crown className="h-4 w-4" />
              Upgrade to Pro
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}

          {isPro && (
            <div className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold">
              <CheckCircle2 className="h-5 w-5" />
              Pro Member
            </div>
          )}
        </div>
      </section>

      {/* Recent Applications */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 dark:border-slate-700 sm:flex-row sm:items-center sm:p-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E0EAFF] dark:bg-[#4169E1]/20">
                <FileText className="h-5 w-5 text-[#4169E1]" />
              </div>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Recent Applications
              </h2>
            </div>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Track the status of your recent tuition applications.
            </p>
          </div>

          <Link
            href="/dashboard/student/applications"
            className="inline-flex items-center gap-2 self-start rounded-xl border border-[#4169E1]/20 bg-[#E0EAFF]/50 px-4 py-2.5 text-sm font-semibold text-[#4169E1] transition hover:bg-[#E0EAFF] dark:border-[#4169E1]/30 dark:bg-[#4169E1]/10 dark:hover:bg-[#4169E1]/20 sm:self-center"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E0EAFF] dark:bg-[#4169E1]/20">
              <BookOpen className="h-8 w-8 text-[#4169E1]" />
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
              No Applications Yet
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              You have not applied for any tuition yet. Explore available
              tuitions and find the right tutor for your learning journey.
            </p>

            <Link
              href="/tuitions"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#4169E1] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2748A5]"
            >
              <Search className="h-4 w-4" />
              Explore Tuitions
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/70">
                <tr className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="px-6 py-4 font-semibold">Tuition</th>
                  <th className="px-6 py-4 font-semibold">Subject</th>
                  <th className="px-6 py-4 font-semibold">Monthly Fee</th>
                  <th className="px-6 py-4 font-semibold">Applied At</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {applications.slice(0, 5).map((application) => (
                  <tr
                    key={application._id}
                    className="transition hover:bg-slate-50/80 dark:hover:bg-slate-700/30"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E0EAFF] dark:bg-[#4169E1]/20">
                          <BookOpen className="h-5 w-5 text-[#4169E1]" />
                        </div>

                        <span className="font-semibold text-slate-800 dark:text-white">
                          {application.tuitionTitle || "Untitled Tuition"}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-slate-600 dark:text-slate-300">
                      {application.subject || "N/A"}
                    </td>

                    <td className="px-6 py-5 font-semibold text-slate-800 dark:text-slate-200">
                      ৳
                      {Number(application.monthlyFee || 0).toLocaleString(
                        "en-BD"
                      )}
                    </td>

                    <td className="px-6 py-5 text-slate-500 dark:text-slate-400">
                      {formatDate(application.appliedAt)}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(
                          application.status
                        )}`}
                      >
                        {application.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {applications.length > 0 && (
          <div className="border-t border-slate-100 px-6 py-4 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing {Math.min(applications.length, 5)} of{" "}
              {applications.length} applications
            </p>
          </div>
        )}
      </section>
    </div>
  );
}