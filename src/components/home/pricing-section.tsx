import Link from "next/link";
import {
  CheckCircle2,
  GraduationCap,
  Users,
  ArrowRight,
  Sparkles,
  Crown,
  ShieldCheck,
  Zap,
} from "lucide-react";

const plans = [
  {
    name: "Student Pro",
    price: "$10",
    description: "A better learning experience for students.",
    icon: GraduationCap,
    badge: "For Students",
    popular: false,
    features: [
      "Access to premium learning features",
      "Apply for tuition opportunities",
      "Track your applications",
      "Personalized student dashboard",
    ],
  },
  {
    name: "Tutor Pro",
    price: "$15",
    description: "Grow your tutoring career with premium access.",
    icon: Users,
    badge: "For Tutors",
    popular: true,
    features: [
      "Access to premium tutor features",
      "Manage tuition applications",
      "Track student applications",
      "Personalized tutor dashboard",
    ],
  },
];

export default function PricingSection() {
  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-[#F8FAFC] px-4 py-20 dark:bg-[#0F172A] sm:px-6 sm:py-24 lg:px-8"
    >
      {/* Decorative Background */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#4169E1]/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#4169E1]/20 bg-[#E0EAFF] px-4 py-2 text-sm font-semibold text-[#2748A5] dark:bg-[#2748A5]/30 dark:text-blue-300">
            <Sparkles size={16} />
            Simple & Transparent Pricing
          </span>

          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
            Choose Your
            <span className="block text-[#4169E1]">Pro Plan</span>
          </h2>

          <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base sm:leading-8">
            Unlock premium features and get more out of your MentorLagbe
            experience. Choose the plan that matches your journey.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto mt-14 grid max-w-5xl gap-8 md:grid-cols-2">
          {plans.map((plan) => {
            const Icon = plan.icon;

            return (
              <div
                key={plan.name}
                className={`group relative flex flex-col overflow-hidden rounded-3xl border bg-white p-7 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:bg-slate-900 sm:p-9 ${
                  plan.popular
                    ? "border-[#4169E1] shadow-[#4169E1]/10 dark:border-blue-500"
                    : "border-slate-200 hover:border-[#4169E1]/50 dark:border-slate-700"
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute right-0 top-0 inline-flex items-center gap-1.5 rounded-bl-2xl bg-[#4169E1] px-4 py-2 text-xs font-bold text-white shadow-md">
                    <Crown size={14} />
                    Popular Plan
                  </div>
                )}

                {/* Card Icon */}
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E0EAFF] text-[#4169E1] transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 dark:bg-[#2748A5]/30 dark:text-blue-300">
                  <Icon size={30} />
                </div>

                {/* Plan Name */}
                <div className="mt-7">
                  <span className="inline-flex rounded-full bg-[#4169E1]/10 px-3 py-1 text-xs font-bold text-[#4169E1] dark:text-blue-300">
                    {plan.badge}
                  </span>

                  <h3 className="mt-4 text-2xl font-extrabold text-slate-900 dark:text-white">
                    {plan.name}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mt-7 flex items-end gap-2">
                  <span className="text-5xl font-extrabold tracking-tight text-[#4169E1]">
                    {plan.price}
                  </span>

                  <span className="pb-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                    / month
                  </span>
                </div>

                {/* Divider */}
                <div className="my-8 h-px bg-slate-200 dark:bg-slate-700" />

                {/* Features */}
                <div className="flex-1">
                  <p className="mb-6 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                    <Zap size={17} className="text-[#4169E1]" />
                    What&apos;s included
                  </p>

                  <ul className="space-y-5">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm leading-6 text-slate-600 dark:text-slate-300"
                      >
                        <CheckCircle2
                          size={19}
                          className="mt-0.5 shrink-0 text-[#4169E1]"
                        />

                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Upgrade Button */}
                <Link
                  href="/pricing"
                  className={`mt-9 flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    plan.popular
                      ? "bg-[#4169E1] shadow-[#4169E1]/25 hover:bg-[#2748A5]"
                      : "bg-[#2748A5] shadow-[#2748A5]/20 hover:bg-[#4169E1]"
                  }`}
                >
                  Upgrade Now
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Security Information */}
        <div className="mt-12 flex flex-col items-center justify-center gap-3 text-center">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <ShieldCheck size={19} className="text-[#4169E1]" />
            Secure Payments Powered by Stripe
          </div>

          <p className="max-w-xl text-xs leading-6 text-slate-500 dark:text-slate-400">
            Choose your plan and upgrade whenever you are ready. Your
            payments are securely processed through Stripe.
          </p>
        </div>
      </div>
    </section>
  );
}