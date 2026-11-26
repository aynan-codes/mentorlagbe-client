"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  Crown,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import {
  getMyPaymentHistory,
  type Payment,
} from "@/services/payment.service";

export default function TutorPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyPaymentHistory();
      setPayments(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load payment history."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const totalPaid = payments
    .filter((payment) => payment.paymentStatus === "paid")
    .reduce((total, payment) => total + payment.amount, 0);

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-BD", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-8 text-slate-900 dark:bg-[#0F172A] dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/dashboard/tutor"
          className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#4169E1] dark:text-slate-400"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[#4169E1]">
              <CreditCard size={21} />
              <span className="text-sm font-semibold">
                Tutor Account
              </span>
            </div>

            <h1 className="text-3xl font-extrabold">
              Payment History
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              View your Tutor Pro membership transactions and payment details.
            </p>
          </div>

          <button
            onClick={fetchPayments}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold transition hover:border-[#4169E1] dark:border-slate-700 dark:bg-slate-900"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        <div className="mb-8 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#E0EAFF] text-[#4169E1] dark:bg-[#2748A5]/30">
              <Wallet size={22} />
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Total Successful Payments
            </p>

            <h2 className="mt-2 text-3xl font-extrabold">
              {formatAmount(
                totalPaid,
                payments[0]?.currency || "usd"
              )}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#E0EAFF] text-[#4169E1] dark:bg-[#2748A5]/30">
              <Crown size={22} />
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Total Transactions
            </p>

            <h2 className="mt-2 text-3xl font-extrabold">
              {payments.length}
            </h2>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
          <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-700">
            <h2 className="text-lg font-bold">
              Transaction Records
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Your Tutor Pro payment details are listed below.
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2
                size={32}
                className="animate-spin text-[#4169E1]"
              />
              <p className="mt-4 text-sm text-slate-500">
                Loading payment history...
              </p>
            </div>
          ) : error ? (
            <div className="px-6 py-16 text-center">
              <p className="text-sm text-red-500">{error}</p>

              <button
                onClick={fetchPayments}
                className="mt-4 rounded-lg bg-[#4169E1] px-5 py-2.5 text-sm font-semibold text-white"
              >
                Try Again
              </button>
            </div>
          ) : payments.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <CreditCard
                size={42}
                className="mx-auto text-slate-300"
              />

              <h3 className="mt-4 text-lg font-bold">
                No Payments Yet
              </h3>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Your Pro membership transactions will appear here.
              </p>

              <Link
                href="/pricing"
                className="mt-6 inline-flex rounded-xl bg-[#4169E1] px-6 py-3 text-sm font-semibold text-white hover:bg-[#2748A5]"
              >
                Explore Pro Plans
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  <tr>
                    <th className="px-6 py-4">Plan</th>
                    <th className="px-6 py-4">Transaction ID</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {payments.map((payment) => (
                    <tr key={payment._id}>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E0EAFF] text-[#4169E1] dark:bg-[#2748A5]/30">
                            <Crown size={19} />
                          </div>

                          <div>
                            <p className="font-semibold">
                              {payment.planName.toUpperCase()} Plan
                            </p>

                            <p className="text-xs text-slate-500">
                              Tutor Membership
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 font-mono text-xs text-slate-500">
                        {payment.transactionId
                          ? `${payment.transactionId.slice(0, 18)}...`
                          : "N/A"}
                      </td>

                      <td className="px-6 py-5 text-slate-500 dark:text-slate-400">
                        {formatDate(payment.paidAt)}
                      </td>

                      <td className="px-6 py-5 font-bold">
                        {formatAmount(
                          payment.amount,
                          payment.currency
                        )}
                      </td>

                      <td className="px-6 py-5">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 dark:bg-green-950/40 dark:text-green-400">
                          <ShieldCheck size={14} />
                          {payment.paymentStatus.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}