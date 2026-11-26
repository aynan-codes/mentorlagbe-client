"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  RefreshCw,
  XCircle,
} from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 py-12 dark:bg-[#0F172A]">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl dark:border-slate-700 dark:bg-slate-900 sm:p-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-500 dark:bg-red-950/40 dark:text-red-400">
          <XCircle size={44} />
        </div>

        <h1 className="mt-7 text-3xl font-extrabold text-slate-900 dark:text-white">
          Payment Cancelled
        </h1>

        <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-slate-400">
          Your payment process was cancelled. No payment has been
          completed through this checkout session. You can try
          again whenever you are ready.
        </p>

        <div className="mt-7 rounded-xl border border-amber-200 bg-amber-50 p-4 text-left dark:border-amber-900 dark:bg-amber-950/30">
          <div className="flex items-start gap-3">
            <CreditCard
              size={20}
              className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400"
            />

            <div>
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                No worries!
              </p>

              <p className="mt-1 text-xs leading-5 text-amber-700 dark:text-amber-400">
                Your account remains on its current plan. You can
                upgrade to Pro later.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/pricing"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#4169E1] px-6 py-3.5 font-semibold text-white transition hover:bg-[#2748A5]"
          >
            <RefreshCw size={18} />
            Try Again
          </Link>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-6 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}