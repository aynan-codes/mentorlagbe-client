import Link from "next/link";
import { ArrowLeft, GraduationCap } from "lucide-react";

import SignInForm from "@/components/auth/sign-in-form";

export default function SignInPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 py-12 dark:bg-[#0F172A]">
      <Link
        href="/"
        className="absolute left-5 top-5 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-[#4169E1]"
      >
        <ArrowLeft size={18} />
        Back to Home
      </Link>

      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2"
        >
          <div className="rounded-xl bg-[#4169E1] p-2">
            <GraduationCap className="h-7 w-7 text-white" />
          </div>

          <span className="text-2xl font-bold text-foreground">
            Mentor<span className="text-[#4169E1]">Lagbe</span>
          </span>
        </Link>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8">
          <SignInForm />
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Find the right tutor. Build a better future.
        </p>
      </div>
    </main>
  );
}