"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Users,
  GraduationCap,
  BookOpen,
  CreditCard,
  Loader2,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

import {
  getAllUsers,
  getPendingTuitions,
  getAllTransactions,
  type AdminUser,
  type AdminTransaction,
} from "@/services/admin.service";

const statStyles = [
  {
    title: "Total Users",
    icon: Users,
    iconBg: "bg-[#E0EAFF] dark:bg-[#4169E1]/20",
    iconColor: "text-[#4169E1]",
    valueColor: "text-slate-900 dark:text-white",
    description: "All registered users",
  },
  {
    title: "Total Students",
    icon: GraduationCap,
    iconBg: "bg-green-100 dark:bg-green-500/10",
    iconColor: "text-green-600 dark:text-green-400",
    valueColor: "text-slate-900 dark:text-white",
    description: "Registered student accounts",
  },
  {
    title: "Total Tutors",
    icon: BookOpen,
    iconBg: "bg-purple-100 dark:bg-purple-500/10",
    iconColor: "text-purple-600 dark:text-purple-400",
    valueColor: "text-slate-900 dark:text-white",
    description: "Registered tutor accounts",
  },
  {
    title: "Pending Tuitions",
    icon: CreditCard,
    iconBg: "bg-amber-100 dark:bg-amber-500/10",
    iconColor: "text-amber-600 dark:text-amber-400",
    valueColor: "text-slate-900 dark:text-white",
    description: "Waiting for admin approval",
  },
];

export default function AdminOverview() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(
    async (showSuccessToast = false) => {
      try {
        setLoading(true);
        setError("");

        const [usersData, pendingData, transactionsData] =
          await Promise.all([
            getAllUsers(),
            getPendingTuitions(),
            getAllTransactions(),
          ]);

        setUsers(usersData);
        setPendingCount(pendingData.length);
        setTransactions(transactionsData);

        if (showSuccessToast) {
          toast.success("Dashboard refreshed successfully.");
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to load admin dashboard.";

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

  const totalStudents = users.filter(
    (user) => user.role === "student"
  ).length;

  const totalTutors = users.filter(
    (user) => user.role === "tutor"
  ).length;

  const totalAdmins = users.filter(
    (user) => user.role === "admin"
  ).length;

  const paidTransactions = transactions.filter(
    (transaction) => transaction.paymentStatus === "paid"
  );

  const stats = [
    users.length,
    totalStudents,
    totalTutors,
    pendingCount,
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

  const getRoleStyle = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-50 text-purple-700 ring-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:ring-purple-500/20";
      case "tutor":
        return "bg-green-50 text-green-700 ring-green-200 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20";
      default:
        return "bg-[#E0EAFF] text-[#2748A5] ring-[#4169E1]/20 dark:bg-[#4169E1]/10 dark:text-blue-300 dark:ring-[#4169E1]/20";
    }
  };

  const getPaymentStatusStyle = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-50 text-green-700 ring-green-200 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20";
      case "pending":
        return "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20";
      default:
        return "bg-red-50 text-red-700 ring-red-200 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20";
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
            Loading Admin Dashboard
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
            onClick={() => loadDashboard(true)}
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
              Admin Dashboard
            </div>

            <h1 className="text-2xl font-bold sm:text-3xl">
              Welcome to Admin Dashboard!
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
              Monitor your MentorLagbe platform, manage registered members,
              review tuition activities and track payment performance.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                onClick={() => loadDashboard(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#2748A5] shadow-sm transition hover:bg-blue-50"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh Dashboard
              </button>

              <div className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white">
                <ShieldCheck className="h-4 w-4" />
                Administrator
              </div>
            </div>
          </div>

          <div className="hidden h-32 w-32 shrink-0 items-center justify-center rounded-3xl border border-white/20 bg-white/10 lg:flex">
            <ShieldCheck className="h-20 w-20 text-white" />
          </div>
        </div>
      </section>

      {/* Main Statistics */}
      <section>
        <div className="mb-5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Platform Statistics
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            An overview of your platform&apos;s registered members and tuition
            activities.
          </p>
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
                  <span>{stat.description}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Platform Overview */}
      <section>
        <div className="mb-5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Platform Overview
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Additional platform and payment statistics.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Total Transactions
              </p>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E0EAFF] dark:bg-[#4169E1]/20">
                <CreditCard className="h-5 w-5 text-[#4169E1]" />
              </div>
            </div>

            <h3 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
              {transactions.length}
            </h3>

            <p className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-400 dark:border-slate-700 dark:text-slate-500">
              <TrendingUp className="h-3.5 w-3.5 text-[#4169E1]" />
              All recorded transactions
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Successful Payments
              </p>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 dark:bg-green-500/10">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>

            <h3 className="mt-4 text-3xl font-bold text-green-600 dark:text-green-400">
              {paidTransactions.length}
            </h3>

            <p className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-400 dark:border-slate-700 dark:text-slate-500">
              <TrendingUp className="h-3.5 w-3.5 text-green-500" />
              Successfully completed payments
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Total Admins
              </p>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-500/10">
                <ShieldCheck className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>

            <h3 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
              {totalAdmins}
            </h3>

            <p className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-400 dark:border-slate-700 dark:text-slate-500">
              <TrendingUp className="h-3.5 w-3.5 text-[#4169E1]" />
              Registered administrator accounts
            </p>
          </div>
        </div>
      </section>

      {/* Recent Users */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 dark:border-slate-700 sm:flex-row sm:items-center sm:p-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E0EAFF] dark:bg-[#4169E1]/20">
                <Users className="h-5 w-5 text-[#4169E1]" />
              </div>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Recent Users
              </h2>
            </div>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Recently registered platform members.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 self-start rounded-xl border border-[#4169E1]/20 bg-[#E0EAFF]/50 px-4 py-2.5 text-sm font-semibold text-[#4169E1] dark:border-[#4169E1]/30 dark:bg-[#4169E1]/10 sm:self-center">
            {users.length} Members
          </div>
        </div>

        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
            <Users className="h-10 w-10 text-slate-300 dark:text-slate-600" />
            <h3 className="mt-3 font-semibold text-slate-900 dark:text-white">
              No Users Found
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Registered members will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/70">
                <tr className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold">Plan</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {users.slice(0, 5).map((user) => (
                  <tr
                    key={user.id}
                    className="transition hover:bg-slate-50/80 dark:hover:bg-slate-700/30"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E0EAFF] dark:bg-[#4169E1]/20">
                          <Users className="h-5 w-5 text-[#4169E1]" />
                        </div>

                        <span className="font-semibold text-slate-800 dark:text-white">
                          {user.name || "Unnamed User"}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-slate-600 dark:text-slate-300">
                      {user.email}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold capitalize ring-1 ${getRoleStyle(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span className="font-semibold capitalize text-slate-700 dark:text-slate-300">
                        {user.plan || "free"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {users.length > 0 && (
          <div className="border-t border-slate-100 px-6 py-4 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing {Math.min(users.length, 5)} of {users.length} users
            </p>
          </div>
        )}
      </section>

      {/* Recent Transactions */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 dark:border-slate-700 sm:flex-row sm:items-center sm:p-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E0EAFF] dark:bg-[#4169E1]/20">
                <CreditCard className="h-5 w-5 text-[#4169E1]" />
              </div>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Recent Transactions
              </h2>
            </div>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Latest payment activities across the platform.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 self-start rounded-xl border border-[#4169E1]/20 bg-[#E0EAFF]/50 px-4 py-2.5 text-sm font-semibold text-[#4169E1] dark:border-[#4169E1]/30 dark:bg-[#4169E1]/10 sm:self-center">
            {transactions.length} Transactions
          </div>
        </div>

        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
            <CreditCard className="h-10 w-10 text-slate-300 dark:text-slate-600" />
            <h3 className="mt-3 font-semibold text-slate-900 dark:text-white">
              No Transactions Yet
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Payment activities will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/70">
                <tr className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold">Plan</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {transactions.slice(0, 5).map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="transition hover:bg-slate-50/80 dark:hover:bg-slate-700/30"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E0EAFF] dark:bg-[#4169E1]/20">
                          <CreditCard className="h-5 w-5 text-[#4169E1]" />
                        </div>

                        <div>
                          <p className="font-semibold text-slate-800 dark:text-white">
                            {transaction.userName || transaction.userEmail}
                          </p>
                          {transaction.userName && (
                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                              {transaction.userEmail}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 capitalize text-slate-600 dark:text-slate-300">
                      {transaction.userRole}
                    </td>

                    <td className="px-6 py-5 font-medium capitalize text-slate-700 dark:text-slate-300">
                      {transaction.planName}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold capitalize ring-1 ${getPaymentStatusStyle(
                          transaction.paymentStatus
                        )}`}
                      >
                        {transaction.paymentStatus}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-slate-500 dark:text-slate-400">
                      {formatDate(transaction.paidAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {transactions.length > 0 && (
          <div className="border-t border-slate-100 px-6 py-4 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing {Math.min(transactions.length, 5)} of{" "}
              {transactions.length} transactions
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
