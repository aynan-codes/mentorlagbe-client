"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Clock,
  AlertCircle,
} from "lucide-react";
import { getMyPaymentHistory } from "@/services/payment.service";
import { authClient } from "@/lib/auth-client";

type PaymentStatus = "checking" | "success" | "pending" | "error";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const { data: session } = authClient.useSession();

  const [status, setStatus] = useState<PaymentStatus>("checking");

  const user = session?.user as
      | { role?: string }
      | undefined;

  const dashboardPath =
    user?.role === "tutor"
      ? "/dashboard/tutor"
      : "/dashboard/student";

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    let cancelled = false;

    const verifyPayment = async () => {
      for (let attempt = 0; attempt < 10; attempt++) {
        try {
          const payments = await getMyPaymentHistory();

          const payment = payments.find(
            (item) => item.stripeSessionId === sessionId
          );

          if (payment?.paymentStatus === "paid") {
            if (!cancelled) {
              setStatus("success");
            }
            return;
          }
        } catch {
          // Retry while the Stripe webhook is being processed.
        }

        if (attempt < 9) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }

      if (!cancelled) {
        setStatus("pending");
      }
    };

    verifyPayment();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 py-12 dark:bg-[#0F172A]">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl dark:border-slate-700 dark:bg-slate-900 sm:p-10">
        {status === "checking" && (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#E0EAFF] text-[#4169E1] dark:bg-[#2748A5]/30">
              <Loader2 size={40} className="animate-spin" />
            </div>

            <h1 className="mt-7 text-2xl font-extrabold text-slate-900 dark:text-white">
              Verifying Your Payment
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Please wait while we confirm your payment with
              Stripe.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-950/40 dark:text-green-400">
              <CheckCircle2 size={44} />
            </div>

            <h1 className="mt-7 text-3xl font-extrabold text-slate-900 dark:text-white">
              Payment Successful!
            </h1>

            <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-slate-400">
              Your payment has been confirmed. Thank you for
              choosing MentorLagbe Pro!
            </p>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-green-600 dark:text-green-400">
              <ShieldCheck size={16} />
              Payment verified successfully
            </div>

            <Link
              href={dashboardPath}
              className="mt-8 block rounded-xl bg-[#4169E1] px-6 py-3.5 font-semibold text-white transition hover:bg-[#2748A5]"
            >
              Go to Dashboard
            </Link>
          </>
        )}

        {status === "pending" && (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
              <Clock size={42} />
            </div>

            <h1 className="mt-7 text-2xl font-extrabold text-slate-900 dark:text-white">
              Payment Confirmation Pending
            </h1>

            <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-slate-400">
              Your payment is not confirmed yet. Stripe may take
              some time to process the confirmation. Please check
              your payment history later.
            </p>

            <Link
              href={dashboardPath}
              className="mt-8 block rounded-xl bg-[#4169E1] px-6 py-3.5 font-semibold text-white transition hover:bg-[#2748A5]"
            >
              Go to Dashboard
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400">
              <AlertCircle size={42} />
            </div>

            <h1 className="mt-7 text-2xl font-extrabold text-slate-900 dark:text-white">
              Unable to Verify Payment
            </h1>

            <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-slate-400">
              We could not find a valid checkout session. Please
              check your payment history or contact support.
            </p>

            <Link
              href="/pricing"
              className="mt-8 block rounded-xl bg-[#4169E1] px-6 py-3.5 font-semibold text-white transition hover:bg-[#2748A5]"
            >
              Back to Pricing
            </Link>
          </>
        )}
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] dark:bg-[#0F172A]">
          <Loader2
            size={40}
            className="animate-spin text-[#4169E1]"
          />
        </main>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}