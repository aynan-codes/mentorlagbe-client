"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  Crown,
  Loader2,
  ShieldCheck,
  Sparkles,
  Bookmark,
  BookOpen,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { createCheckoutSession } from "@/services/payment.service";

const plans = [
  {
    role: "student",
    name: "Student Pro",
    price: 10,
    description: "Find the right tutor and make learning easier.",
    freeLimit: "Free Plan: Save up to 5 tuition opportunities.",
    proLimit: "Pro Plan: Save unlimited tuition opportunities.",
    features: [
      "Unlimited tuition bookmarks",
      "Apply for available tuition opportunities",
      "Track your tuition applications",
      "Manage your learning activities",
      "Priority access to platform features",
    ],
  },
  {
    role: "tutor",
    name: "Tutor Pro",
    price: 15,
    description: "Grow your tutoring career with premium access.",
    freeLimit: "Free Plan: Post up to 2 tuition opportunities.",
    proLimit: "Pro Plan: Post unlimited tuition opportunities.",
    features: [
      "Unlimited tuition posts",
      "Manage your tuition opportunities",
      "Receive student applications",
      "Manage your tutoring activities",
      "Access premium platform features",
    ],
  },
];

export default function PricingPage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [loadingRole, setLoadingRole] = useState<
    "student" | "tutor" | null
  >(null);

  const [error, setError] = useState("");

  const user = session?.user;

  const userRole = (
    user as typeof user & {
      role?: string;
      plan?: string;
    }
  )?.role;

  const userPlan = (
    user as typeof user & {
      role?: string;
      plan?: string;
    }
  )?.plan;

  const handleSubscribe = async (planRole: string) => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    if (userRole !== planRole) {
      return;
    }

    if (userRole !== "student" && userRole !== "tutor") {
      setError("Only students and tutors can purchase a Pro plan.");
      return;
    }

    if (userPlan === "pro") {
      setError("You are already a Pro member.");
      return;
    }

    try {
      setLoadingRole(planRole as "student" | "tutor");
      setError("");

      const checkoutUrl = await createCheckoutSession();

      window.location.assign(checkoutUrl);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to start payment. Please try again."
      );

      setLoadingRole(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-16 text-slate-900 dark:bg-[#0F172A] dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Page Heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#E0EAFF] px-4 py-2 text-sm font-semibold text-[#2748A5] dark:bg-[#2748A5]/30 dark:text-blue-300">
            <Sparkles size={16} />
            Unlock Your Potential
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            Choose Your{" "}
            <span className="text-[#4169E1]">Pro Plan</span>
          </h1>

          <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg">
            Get more from MentorLagbe with affordable Pro membership plans
            designed for students and tutors.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            role="alert"
            className="mx-auto mb-8 max-w-xl rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-center text-sm text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400"
          >
            {error}
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid gap-8 md:grid-cols-2">
          {plans.map((plan) => {
            const isCurrentPlan = userRole === plan.role;
            const isPro = isCurrentPlan && userPlan === "pro";
            const isLoading = loadingRole === plan.role;

            return (
              <div
                key={plan.role}
                className={`relative flex flex-col rounded-3xl border bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900 sm:p-9 ${
                  plan.role === "tutor"
                    ? "border-[#4169E1] ring-2 ring-[#4169E1]/20"
                    : "border-slate-200 dark:border-slate-700"
                }`}
              >
                {plan.role === "tutor" && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#4169E1] px-5 py-2 text-xs font-bold text-white shadow-md">
                    POPULAR PLAN
                  </div>
                )}

                {/* Plan Icon */}
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E0EAFF] text-[#4169E1] dark:bg-[#2748A5]/30 dark:text-blue-300">
                  {plan.role === "student" ? (
                    <Sparkles size={27} />
                  ) : (
                    <Crown size={27} />
                  )}
                </div>

                <h2 className="text-2xl font-bold">{plan.name}</h2>

                <p className="mt-3 min-h-12 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {plan.description}
                </p>

                {/* Free and Pro Limits */}
                <div className="mt-5 space-y-3 rounded-2xl bg-[#F8FAFC] p-4 dark:bg-slate-800">
                  <div className="flex items-start gap-3">
                    {plan.role === "student" ? (
                      <Bookmark
                        size={19}
                        className="mt-0.5 shrink-0 text-[#4169E1]"
                      />
                    ) : (
                      <BookOpen
                        size={19}
                        className="mt-0.5 shrink-0 text-[#4169E1]"
                      />
                    )}

                    <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {plan.freeLimit}
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <Crown
                      size={19}
                      className="mt-0.5 shrink-0 text-[#4169E1]"
                    />

                    <p className="text-sm font-semibold leading-6 text-[#4169E1] dark:text-blue-300">
                      {plan.proLimit}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div className="my-7 flex items-end gap-2">
                  <span className="text-5xl font-extrabold tracking-tight">
                    ${plan.price}
                  </span>

                  <span className="pb-2 text-sm text-slate-500 dark:text-slate-400">
                    / one-time payment
                  </span>
                </div>

                <div className="mb-7 h-px bg-slate-200 dark:bg-slate-700" />

                {/* Features */}
                <h3 className="mb-5 font-semibold">
                  Pro Plan Includes:
                </h3>

                <ul className="mb-9 flex-1 space-y-4">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E0EAFF] text-[#4169E1] dark:bg-[#2748A5]/40 dark:text-blue-300">
                        <Check size={13} strokeWidth={3} />
                      </span>

                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Subscribe Button */}
                <button
                  type="button"
                  onClick={() => handleSubscribe(plan.role)}
                  disabled={
                    isPending ||
                    loadingRole !== null ||
                    isPro ||
                    (Boolean(user) && !isCurrentPlan)
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4169E1] px-6 py-4 font-semibold text-white transition hover:bg-[#2748A5] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={19} className="animate-spin" />
                      Redirecting to Payment...
                    </>
                  ) : isPending ? (
                    "Checking Account..."
                  ) : isPro ? (
                    "Already a Pro Member"
                  ) : user && !isCurrentPlan ? (
                    "Not Your Account Type"
                  ) : user ? (
                    "Upgrade to Pro"
                  ) : (
                    "Sign In to Continue"
                  )}
                </button>

                {isCurrentPlan && !isPro && (
                  <p className="mt-3 text-center text-xs text-[#4169E1]">
                    This plan matches your account type.
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Payment Security */}
        <div className="mt-12 flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <ShieldCheck size={19} className="text-[#4169E1]" />
          Secure payment powered by Stripe.
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm font-semibold text-[#4169E1] transition hover:text-[#2748A5]"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}