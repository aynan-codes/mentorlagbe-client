"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CreditCard,
  Loader2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Receipt,
  Search,
} from "lucide-react";
import { toast } from "sonner";

import {
  getAllTransactions,
  type AdminTransaction,
} from "@/services/admin.service";

export default function TransactionTable() {
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  // Load All Transactions
  const loadTransactions = useCallback(
    async (showSuccessToast = false) => {
      try {
        setLoading(true);
        setError("");

        const data = await getAllTransactions();

        setTransactions(data);

        if (showSuccessToast) {
          toast.success("Transactions refreshed successfully.");
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to load transactions.";

        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadTransactions();
  }, [loadTransactions]);

  // Successful Payments
  const paidTransactions = transactions.filter(
    (transaction) => transaction.paymentStatus === "paid",
  );

  // Total Revenue
  const totalRevenue = paidTransactions.reduce(
    (total, transaction) => total + transaction.amount,
    0,
  );

  // Format Payment Amount
  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency?.toUpperCase() || "USD",
    }).format(amount / 100);
  };

  // Format Total Revenue
  const formattedRevenue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(totalRevenue / 100);

  // Search and Filter Transactions
  const filteredTransactions = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return transactions.filter((transaction) => {
      const matchesSearch =
        !searchTerm ||
        transaction.userName?.toLowerCase().includes(searchTerm) ||
        transaction.userEmail?.toLowerCase().includes(searchTerm) ||
        transaction.transactionId?.toLowerCase().includes(searchTerm) ||
        transaction.planName?.toLowerCase().includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" ||
        transaction.paymentStatus === statusFilter;

      const matchesRole =
        roleFilter === "all" || transaction.userRole === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [transactions, search, statusFilter, roleFilter]);

  // Payment Status Badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Paid
          </span>
        );

      case "pending":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            <Clock className="h-3.5 w-3.5" />
            Pending
          </span>
        );

      case "failed":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-400">
            <XCircle className="h-3.5 w-3.5" />
            Failed
          </span>
        );

      default:
        return (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {status}
          </span>
        );
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex min-h-60 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#4169E1]" />

        <span className="ml-3 text-sm text-slate-500">
          Loading transactions...
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
          onClick={() => void loadTransactions()}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#4169E1] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2748A5]"
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
            Payment Transactions
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Monitor all Pro subscription payments.
          </p>
        </div>

        <button
          onClick={() => void loadTransactions(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <Receipt className="h-6 w-6 text-[#4169E1]" />

          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Total Transactions
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            {transactions.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <CheckCircle2 className="h-6 w-6 text-green-500" />

          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Successful Payments
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            {paidTransactions.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <CreditCard className="h-6 w-6 text-purple-500" />

          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Total Revenue
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            {formattedRevenue}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:grid-cols-2 xl:grid-cols-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email or transaction ID..."
            className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        {/* Payment Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#4169E1] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        >
          <option value="all">All Payment Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>

        {/* User Role Filter */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#4169E1] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        >
          <option value="all">All User Roles</option>
          <option value="student">Students</option>
          <option value="tutor">Tutors</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {/* Results Count */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Showing{" "}
          <span className="font-semibold text-slate-900 dark:text-white">
            {filteredTransactions.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-900 dark:text-white">
            {transactions.length}
          </span>{" "}
          transactions
        </p>

        {(search || statusFilter !== "all" || roleFilter !== "all") && (
          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("all");
              setRoleFilter("all");
            }}
            className="text-sm font-medium text-[#4169E1] hover:underline"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Transactions Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {filteredTransactions.length === 0 ? (
          <div className="py-16 text-center">
            <CreditCard className="mx-auto h-12 w-12 text-slate-400" />

            <h3 className="mt-4 font-semibold text-slate-800 dark:text-white">
              {transactions.length === 0
                ? "No Transactions Yet"
                : "No Transactions Found"}
            </h3>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {transactions.length === 0
                ? "Payment records will appear here after successful payments."
                : "Try changing your search or filter options."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-4">User</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4">Plan</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Transaction ID</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Payment Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    {/* User Information */}
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {transaction.userName}
                      </p>

                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {transaction.userEmail}
                      </p>
                    </td>

                    {/* User Role */}
                    <td className="px-5 py-4 capitalize text-slate-600 dark:text-slate-300">
                      {transaction.userRole}
                    </td>

                    {/* Plan */}
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-[#E0EAFF] px-3 py-1 text-xs font-semibold text-[#2748A5]">
                        {transaction.planName.toUpperCase()}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">
                      {formatAmount(
                        transaction.amount,
                        transaction.currency,
                      )}
                    </td>

                    {/* Transaction ID */}
                    <td
                      className="max-w-40 truncate px-5 py-4 font-mono text-xs text-slate-500 dark:text-slate-400"
                      title={transaction.transactionId}
                    >
                      {transaction.transactionId}
                    </td>

                    {/* Payment Status */}
                    <td className="px-5 py-4">
                      {getStatusBadge(transaction.paymentStatus)}
                    </td>

                    {/* Payment Date */}
                    <td className="whitespace-nowrap px-5 py-4 text-slate-500 dark:text-slate-400">
                      {transaction.paidAt
                        ? new Date(transaction.paidAt).toLocaleDateString(
                            "en-BD",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}