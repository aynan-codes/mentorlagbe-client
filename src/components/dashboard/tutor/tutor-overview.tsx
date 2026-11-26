"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle,
  Clock,
  XCircle,
  Users,
  UserCheck,
  UserX,
  Loader2,
  RefreshCw,
  AlertCircle,
  GraduationCap,
  Crown,
  ArrowRight,
  TrendingUp,
  ClipboardList,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { useSession } from "@/lib/auth-client";
import StatCard from "@/components/dashboard/stat-card";

import { getMyTuitions } from "@/services/tuition.service";
import {
  getTutorApplications,
  type Application,
} from "@/services/application.service";

import type { Tuition } from "@/types/tuition.types";

export default function TutorOverview() {
  const { data: session } = useSession();

  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = session?.user as
    | {
        name?: string;
        plan?: string;
      }
    | undefined;

  const currentPlan = user?.plan || "free";
  const isPro = currentPlan.toLowerCase() === "pro";

  // Load Dashboard Data
  const loadDashboard = useCallback(
    async (showSuccessToast = false) => {
      try {
        setLoading(true);
        setError("");

        const [tuitionData, applicationData] = await Promise.all([
          getMyTuitions(),
          getTutorApplications(),
        ]);

        setTuitions(tuitionData);
        setApplications(applicationData);

        if (showSuccessToast) {
          toast.success("Dashboard refreshed successfully.");
        }
      } catch (err) {
        console.error("Tutor Dashboard Error:", err);

        const message =
          err instanceof Error
            ? err.message
            : "Unable to load dashboard information.";

        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  // Tuition Statistics
  const approvedTuitions = tuitions.filter(
    (tuition) => tuition.approvalStatus === "approved"
  ).length;

  const pendingTuitions = tuitions.filter(
    (tuition) => tuition.approvalStatus === "pending"
  ).length;

  const rejectedTuitions = tuitions.filter(
    (tuition) => tuition.approvalStatus === "rejected"
  ).length;

  const activeTuitions = tuitions.filter(
    (tuition) => tuition.isActive
  ).length;

  // Application Statistics
  const pendingApplications = applications.filter(
    (application) => application.status === "pending"
  ).length;

  const acceptedApplications = applications.filter(
    (application) => application.status === "accepted"
  ).length;

  const rejectedApplications = applications.filter(
    (application) => application.status === "rejected"
  ).length;

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E0EAFF] dark:bg-slate-800">
          <Loader2 className="h-7 w-7 animate-spin text-[#4169E1]" />
        </div>

        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/50 dark:bg-red-950/20">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-900/30">
          <AlertCircle className="h-7 w-7 text-red-500" />
        </div>

        <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
          Unable to Load Dashboard
        </h3>

        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>

        <button
          onClick={() => loadDashboard(true)}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#4169E1] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2748A5]"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-7">

      {/* Welcome Section */}
      <section className="relative overflow-hidden rounded-2xl border border-[#E0EAFF] bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">

        <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-[#E0EAFF]/70 blur-3xl dark:bg-[#4169E1]/10" />

        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#E0EAFF] px-3 py-1.5 text-xs font-semibold text-[#2748A5] dark:bg-slate-800 dark:text-blue-300">
              <Sparkles className="h-3.5 w-3.5" />
              Tutor Workspace
            </div>

            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              Welcome{user?.name ? `, ${user.name}` : " Back"}!
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Manage your tuition posts, track student applications and grow
              your teaching opportunities from one place.
            </p>
          </div>

          <button
            onClick={() => loadDashboard(true)}
            disabled={loading}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-[#4169E1] hover:bg-[#E0EAFF] hover:text-[#2748A5] disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </button>
        </div>

        <div className="relative mt-7 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5 sm:grid-cols-3 dark:border-slate-800">

          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Total Tuitions
            </p>

            <p className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
              {tuitions.length}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Total Applications
            </p>

            <p className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
              {applications.length}
            </p>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Pending Responses
            </p>

            <p className="mt-1 text-2xl font-extrabold text-amber-500">
              {pendingApplications}
            </p>
          </div>
        </div>
      </section>

      {/* Subscription Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2748A5] to-[#4169E1] p-6 text-white shadow-lg sm:p-8">

        <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full border-[30px] border-white/10" />

        <div className="absolute -bottom-20 right-36 h-52 w-52 rounded-full bg-white/10 blur-2xl" />

        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">

          <div className="max-w-xl">

            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white">
              <Crown className="h-4 w-4" />
              Your Subscription
            </div>

            <h2 className="text-3xl font-extrabold">
              {isPro ? "Pro Plan" : "Free Plan"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-blue-100">
              {isPro
                ? "Enjoy unlimited tuition opportunities with your Pro membership."
                : "Start with up to 2 tuition posts. Upgrade to Pro to unlock unlimited tuition posting."}
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold">
              <BookOpen className="h-4 w-4" />

              {isPro ? (
                <span>Unlimited Tuition Posts</span>
              ) : (
                <span>
                  Tuition Post Limit: 2 ({tuitions.length}/2 used)
                </span>
              )}
            </div>
          </div>

          {!isPro && (
            <Link
              href="/pricing"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-[#2748A5] shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
            >
              Upgrade to Pro
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}

          {isPro && (
            <div className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/25 bg-white/15 px-5 py-3.5 text-sm font-bold">
              <CheckCircle className="h-5 w-5" />
              Pro Membership Active
            </div>
          )}
        </div>
      </section>

      {/* Tuition Statistics */}
      <section className="space-y-4">

        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Tuition Overview
            </h3>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Track the performance of your tuition posts.
            </p>
          </div>

          <Link
            href="/dashboard/tutor/my-tuitions"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4169E1] transition hover:text-[#2748A5]"
          >
            View All Tuitions
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Total Tuitions"
            value={tuitions.length}
            description="All your tuition posts"
            icon={BookOpen}
          />

          <StatCard
            title="Approved Tuitions"
            value={approvedTuitions}
            description="Approved by admin"
            icon={CheckCircle}
            iconColor="text-green-600"
          />

          <StatCard
            title="Pending Tuitions"
            value={pendingTuitions}
            description="Waiting for approval"
            icon={Clock}
            iconColor="text-amber-500"
          />

          <StatCard
            title="Rejected Tuitions"
            value={rejectedTuitions}
            description="Rejected by admin"
            icon={XCircle}
            iconColor="text-red-500"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">

          <StatCard
            title="Active Tuitions"
            value={activeTuitions}
            description="Currently active posts"
            icon={GraduationCap}
            iconColor="text-green-600"
          />

          <StatCard
            title="Closed Tuitions"
            value={tuitions.length - activeTuitions}
            description="Inactive tuition posts"
            icon={BookOpen}
            iconColor="text-slate-500"
          />
        </div>
      </section>

      {/* Application Statistics */}
      <section className="space-y-4">

        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Student Applications
            </h3>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Monitor applications received from students.
            </p>
          </div>

          <Link
            href="/dashboard/tutor/applicants"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4169E1] transition hover:text-[#2748A5]"
          >
            Manage Applicants
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Total Applications"
            value={applications.length}
            description="Applications received"
            icon={Users}
          />

          <StatCard
            title="Pending Applications"
            value={pendingApplications}
            description="Waiting for your response"
            icon={Clock}
            iconColor="text-amber-500"
          />

          <StatCard
            title="Accepted Applications"
            value={acceptedApplications}
            description="Applications accepted"
            icon={UserCheck}
            iconColor="text-green-600"
          />

          <StatCard
            title="Rejected Applications"
            value={rejectedApplications}
            description="Applications rejected"
            icon={UserX}
            iconColor="text-red-500"
          />
        </div>
      </section>

      {/* Recent Applications */}
      <section className="space-y-4">

        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Recent Applications
            </h3>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Latest students who applied to your tuition posts.
            </p>
          </div>

          <Link
            href="/dashboard/tutor/applicants"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4169E1] transition hover:text-[#2748A5]"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

          {/* Table Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">

            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E0EAFF] dark:bg-slate-800">
                <ClipboardList className="h-4 w-4 text-[#4169E1]" />
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Application List
                </h4>

                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Latest 5 applications
                </p>
              </div>
            </div>

            <span className="rounded-full bg-[#E0EAFF] px-3 py-1 text-xs font-bold text-[#2748A5] dark:bg-slate-800 dark:text-blue-300">
              {applications.length} Total
            </span>
          </div>

          {applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-5 py-14 text-center">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E0EAFF] dark:bg-slate-800">
                <Users className="h-8 w-8 text-[#4169E1]" />
              </div>

              <h4 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                No Applications Yet
              </h4>

              <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                Student applications will appear here when someone applies to
                your tuition posts.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[650px] text-left text-sm">

                <thead className="bg-slate-50 dark:bg-slate-800/70">
                  <tr>
                    <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Student
                    </th>

                    <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Tuition
                    </th>

                    <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Subject
                    </th>

                    <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">

                  {applications.slice(0, 5).map((application) => (
                    <tr
                      key={application._id}
                      className="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                    >
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E0EAFF] text-xs font-bold text-[#2748A5] dark:bg-slate-800 dark:text-blue-300">
                            {application.studentName
                              ?.charAt(0)
                              .toUpperCase() || "S"}
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-[160px] truncate text-sm font-bold text-slate-900 dark:text-white">
                              {application.studentName}
                            </p>

                            <p className="mt-1 max-w-[180px] truncate text-xs text-slate-500 dark:text-slate-400">
                              {application.studentEmail}
                            </p>
                          </div>

                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="max-w-[180px] truncate font-medium text-slate-700 dark:text-slate-300">
                          {application.tuitionTitle}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {application.subject}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold capitalize ${
                            application.status === "accepted"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : application.status === "rejected"
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              application.status === "accepted"
                                ? "bg-green-500"
                                : application.status === "rejected"
                                  ? "bg-red-500"
                                  : "bg-amber-500"
                            }`}
                          />

                          {application.status}
                        </span>
                      </td>
                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
          )}

          {/* Table Footer */}
          {applications.length > 0 && (
            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 dark:border-slate-800">

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Showing {Math.min(applications.length, 5)} of{" "}
                {applications.length} applications
              </p>

              <Link
                href="/dashboard/tutor/applicants"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#4169E1] transition hover:text-[#2748A5]"
              >
                See All
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}