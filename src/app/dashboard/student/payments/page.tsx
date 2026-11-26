"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  Crown,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Wallet,
  ArrowLeft,
  CalendarDays,
  Receipt,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

import {
  getMyPaymentHistory,
  type Payment,
} from "@/services/payment.service";

export default function StudentPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPayments = useCallback(
    async (showSuccessToast = false) => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyPaymentHistory();

        setPayments(Array.isArray(data) ? data : []);

        if (showSuccessToast) {
          toast.success("Payment history refreshed successfully.");
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unable to load payment history.";

        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const successfulPayments = payments.filter(
    (payment) => payment.paymentStatus === "paid"
  );

  const totalPaid = successfulPayments.reduce(
    (total, payment) => total + payment.amount,
    0
  );

  const pendingPayments = payments.filter(
    (payment) => payment.paymentStatus === "pending"
  ).length;

  const formatAmount = (amount: number, currency: string) => {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency.toUpperCase(),
      }).format(amount / 100);
    } catch {
      return `${(amount / 100).toFixed(2)} ${currency.toUpperCase()}`;
    }
  };

  const formatDate = (date: string) => {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[#4169E1]">
            <CreditCard size={21} />
            <span className="text-sm font-semibold">
              Student Account
            </span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Payment History
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            View your Pro membership transactions and payment details.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/student"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ArrowLeft size={16} />
            Dashboard
          </Link>

          <button
            type="button"
            onClick={() => fetchPayments(true)}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#4169E1] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2748A5] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Payments"
          value={payments.length}
          description="All recorded transactions"
          icon={<Receipt size={20} />}
        />

        <SummaryCard
          title="Total Successful"
          value={successfulPayments.length}
          description="Successfully completed payments"
          icon={<ShieldCheck size={20} />}
        />

        <SummaryCard
          title="Total Amount Paid"
          value={formatAmount(
            totalPaid,
            payments[0]?.currency || "usd"
          )}
          description="Total successful payment amount"
          icon={<Wallet size={20} />}
        />

        <SummaryCard
          title="Pending Payments"
          value={pendingPayments}
          description="Payments awaiting confirmation"
          icon={<CalendarDays size={20} />}
        />
      </div>

      {/* Transaction Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Transaction Records
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Your Student Pro membership payment history.
            </p>
          </div>

          <span className="w-fit rounded-full bg-[#4169E1]/10 px-3 py-1.5 text-xs font-semibold text-[#4169E1]">
            {payments.length} Transactions
          </span>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2
              size={32}
              className="animate-spin text-[#4169E1]"
            />

            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Loading payment history...
            </p>
          </div>
        ) : error ? (
          /* Error */
          <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
            <AlertCircle size={38} className="text-red-500" />

            <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
              Unable to Load Payments
            </h3>

            <p className="mt-2 max-w-md text-sm text-red-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() => fetchPayments(true)}
              className="mt-5 rounded-lg bg-[#4169E1] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2748A5]"
            >
              Try Again
            </button>
          </div>
        ) : payments.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#4169E1]/10">
              <CreditCard size={30} className="text-[#4169E1]" />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
              No Payments Yet
            </h3>

            <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              Your Pro membership transactions will appear here after
              a successful payment.
            </p>

            <Link
              href="/pricing"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#4169E1] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2748A5]"
            >
              <Crown size={17} />
              Explore Pro Plans
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/70">
                  <tr className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    <th className="px-5 py-4 font-semibold">
                      Plan
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Transaction ID
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Date
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Amount
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {payments.map((payment) => (
                    <tr
                      key={payment._id}
                      className="transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#4169E1]/10 text-[#4169E1]">
                            <Crown size={19} />
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                              {payment.planName.toUpperCase()} Plan
                            </p>

                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              Student Membership
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">
                        {payment.transactionId
                          ? `${payment.transactionId.slice(0, 18)}...`
                          : "N/A"}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
                        {formatDate(payment.paidAt)}
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                        {formatAmount(
                          payment.amount,
                          payment.currency
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <PaymentStatus status={payment.paymentStatus} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:hidden">
              {payments.map((payment) => (
                <div
                  key={payment._id}
                  className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#4169E1]/10 text-[#4169E1]">
                        <Crown size={19} />
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                          {payment.planName.toUpperCase()} Plan
                        </h3>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Student Membership
                        </p>
                      </div>
                    </div>

                    <PaymentStatus status={payment.paymentStatus} />
                  </div>

                  <div className="mt-4 space-y-3 border-t border-slate-100 pt-3 dark:border-slate-800">
                    <div className="flex justify-between gap-3 text-xs">
                      <span className="text-slate-500 dark:text-slate-400">
                        Transaction ID
                      </span>

                      <span className="max-w-[180px] truncate font-mono text-slate-700 dark:text-slate-300">
                        {payment.transactionId || "N/A"}
                      </span>
                    </div>

                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">
                        Date
                      </span>

                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {formatDate(payment.paidAt)}
                      </span>
                    </div>

                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">
                        Amount
                      </span>

                      <span className="font-bold text-slate-900 dark:text-white">
                        {formatAmount(
                          payment.amount,
                          payment.currency
                        )}
                      </span>
                    </div>
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
  description,
  icon,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
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

function PaymentStatus({ status }: { status: string }) {
  const normalizedStatus = status.toLowerCase();

  const styles: Record<string, string> = {
    paid: "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",
    pending: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    failed: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
    cancelled: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  };

  const icons: Record<string, React.ReactNode> = {
    paid: <ShieldCheck size={13} />,
    pending: <Loader2 size={13} />,
    failed: <AlertCircle size={13} />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
        styles[normalizedStatus] ||
        "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
      }`}
    >
      {icons[normalizedStatus]}
      {normalizedStatus.toUpperCase()}
    </span>
  );
}