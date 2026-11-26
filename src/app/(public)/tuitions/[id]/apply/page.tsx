"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Send,
  Phone,
  CalendarDays,
  MessageSquare,
  Loader2,
  GraduationCap,
  AlertCircle,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { createApplication } from "@/services/application.service";

export default function ApplyTuitionPage() {
  const params = useParams();
  const router = useRouter();

  const tuitionId = params.id as string;

  const { data: session, isPending } = authClient.useSession();

  const [studentPhone, setStudentPhone] = useState("");
  const [preferredSchedule, setPreferredSchedule] = useState("");
  const [studentNote, setStudentNote] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const user = session?.user as
    | {
        id: string;
        email: string;
        name: string;
        role?: string;
      }
    | undefined;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!studentPhone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    if (!preferredSchedule.trim()) {
      setError("Please enter your preferred schedule.");
      return;
    }

    if (!/^[0-9+\-\s()]{8,20}$/.test(studentPhone.trim())) {
      setError("Please enter a valid phone number.");
      return;
    }

    try {
      setLoading(true);

      await createApplication({
        tuitionId,
        studentPhone: studentPhone.trim(),
        preferredSchedule: preferredSchedule.trim(),
        studentNote: studentNote.trim(),
      });

      setSuccess("Your application has been submitted successfully!");

      setTimeout(() => {
        router.push("/dashboard/student/applications");
        router.refresh();
      }, 1200);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit application. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] dark:bg-[#0F172A]">
        <Loader2 className="animate-spin text-[#4169E1]" size={36} />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 dark:bg-[#0F172A]">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <GraduationCap
            size={48}
            className="mx-auto mb-4 text-[#4169E1]"
          />

          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Login Required
          </h1>

          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Please sign in with your student account before applying.
          </p>

          <Link
            href={`/sign-in?callbackUrl=/tuitions/${tuitionId}/apply`}
            className="mt-6 inline-flex rounded-xl bg-[#4169E1] px-6 py-3 font-semibold text-white transition hover:bg-[#2748A5]"
          >
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  if (user.role !== "student") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 dark:bg-[#0F172A]">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <AlertCircle
            size={48}
            className="mx-auto mb-4 text-amber-500"
          />

          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Application Not Allowed
          </h1>

          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Only student accounts can apply for tuition. Your current account
            does not have student permissions.
          </p>

          <Link
            href={`/tuitions/${tuitionId}`}
            className="mt-6 inline-flex rounded-xl bg-[#4169E1] px-6 py-3 font-semibold text-white transition hover:bg-[#2748A5]"
          >
            Back to Tuition
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] py-12 dark:bg-[#0F172A]">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

        <Link
          href={`/tuitions/${tuitionId}`}
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#4169E1] hover:text-[#2748A5]"
        >
          <ArrowLeft size={18} />
          Back to Tuition Details
        </Link>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">

          <div className="bg-[#4169E1] px-6 py-8 text-white sm:px-8">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
              <GraduationCap size={28} />
            </div>

            <h1 className="text-2xl font-bold sm:text-3xl">
              Apply for Tuition
            </h1>

            <p className="mt-2 text-sm text-blue-100">
              Complete the form below to send your application to the tutor.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-6 sm:p-8">

            {/* Student Information */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Student Information
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Your account information is automatically connected.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Student Name
              </label>

              <input
                type="text"
                value={user.name}
                readOnly
                className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-600 outline-none dark:border-slate-700 dark:bg-slate-700 dark:text-slate-300"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Email Address
              </label>

              <input
                type="email"
                value={user.email}
                readOnly
                className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-600 outline-none dark:border-slate-700 dark:bg-slate-700 dark:text-slate-300"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <Phone size={17} className="text-[#4169E1]" />
                Phone Number *
              </label>

              <input
                type="tel"
                placeholder="01XXXXXXXXX"
                value={studentPhone}
                onChange={(event) => setStudentPhone(event.target.value)}
                required
                maxLength={20}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>

            {/* Preferred Schedule */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <CalendarDays size={17} className="text-[#4169E1]" />
                Preferred Schedule *
              </label>

              <input
                type="text"
                placeholder="Example: Saturday - Thursday, 5 PM - 7 PM"
                value={preferredSchedule}
                onChange={(event) =>
                  setPreferredSchedule(event.target.value)
                }
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>

            {/* Learning Note */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <MessageSquare size={17} className="text-[#4169E1]" />
                Learning Note
              </label>

              <textarea
                rows={5}
                placeholder="Tell the tutor about your learning goals, current preparation, or anything important..."
                value={studentNote}
                onChange={(event) => setStudentNote(event.target.value)}
                maxLength={1000}
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />

              <p className="mt-1 text-right text-xs text-slate-400">
                {studentNote.length}/1000 characters
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400">
                {success}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4169E1] px-6 py-4 font-semibold text-white transition hover:bg-[#2748A5] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Submitting Application...
                </>
              ) : (
                <>
                  <Send size={19} />
                  Submit Application
                </>
              )}
            </button>

            <p className="text-center text-xs leading-5 text-slate-500 dark:text-slate-400">
              By submitting this application, you agree to share your contact
              information with the tutor.
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}