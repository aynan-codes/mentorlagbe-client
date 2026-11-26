"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  BookOpen,
  MapPin,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

import {
  completeGoogleOnboarding,
  getMyProfile,
} from "@/services/user.service";

import type { UserRole } from "@/services/auth.service";
import { BANGLADESH_DIVISIONS } from "@/lib/locations";
import { authClient } from "@/lib/auth-client";

export default function CompleteProfilePage() {
  const router = useRouter();

  const [role, setRole] = useState<UserRole>("student");
  const [division, setDivision] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const initializeProfile = async () => {
      try {
        const user = await getMyProfile();

        // Already completed users should go to their dashboard.
        if (user.division) {
          router.replace(
            user.role === "tutor"
              ? "/dashboard/tutor"
              : user.role === "admin"
                ? "/dashboard/admin"
                : "/dashboard/student"
          );
          return;
        }

        // Restore role and division selected before Google redirect.
        const savedData = sessionStorage.getItem(
          "mentorlagbe_google_onboarding"
        );

        if (savedData) {
          try {
            const parsed = JSON.parse(savedData);

            if (parsed.role === "student" || parsed.role === "tutor") {
              setRole(parsed.role);
            }

            if (BANGLADESH_DIVISIONS.includes(parsed.division)) {
              setDivision(parsed.division);
            }
          } catch {
            sessionStorage.removeItem("mentorlagbe_google_onboarding");
          }
        }
      } catch (err) {
        console.error("Profile Loading Error:", err);
        setError("Unable to load your account. Please sign in again.");
      } finally {
        setLoading(false);
      }
    };

    initializeProfile();
  }, [router]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!division) {
      toast.error("Please select your division.");
      return;
    }

    try {
      setSubmitting(true);

      await completeGoogleOnboarding({
        role,
        division,
      });

      // Refresh JWT with the updated role.
      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        throw new Error(
          error?.message || "Failed to refresh authentication token."
        );
      }

      sessionStorage.removeItem("mentorlagbe_google_onboarding");

      toast.success("Your account setup is complete!");

      router.replace(
        role === "tutor"
          ? "/dashboard/tutor"
          : "/dashboard/student"
      );

      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to complete your account setup.";

      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-[#4169E1]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
        <p className="text-sm text-destructive">{error}</p>

        <button
          onClick={() => router.replace("/sign-in")}
          className="rounded-xl bg-[#4169E1] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2748A5]"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-lg space-y-6 rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8">
        {/* Header */}
        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4169E1]/10">
            <CheckCircle2 className="h-7 w-7 text-[#4169E1]" />
          </div>

          <h1 className="text-2xl font-bold text-foreground">
            Complete Your Profile
          </h1>

          <p className="text-sm text-muted-foreground">
            Choose your account type and division to get started
            with MentorLagbe.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Role Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              I want to register as
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={submitting}
                onClick={() => setRole("student")}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                  role === "student"
                    ? "border-[#4169E1] bg-[#4169E1]/10 ring-1 ring-[#4169E1]"
                    : "border-border hover:border-[#4169E1]/50"
                }`}
              >
                <GraduationCap
                  className={`h-6 w-6 ${
                    role === "student"
                      ? "text-[#4169E1]"
                      : "text-muted-foreground"
                  }`}
                />

                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Student
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Find a tutor
                  </p>
                </div>
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={() => setRole("tutor")}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                  role === "tutor"
                    ? "border-[#4169E1] bg-[#4169E1]/10 ring-1 ring-[#4169E1]"
                    : "border-border hover:border-[#4169E1]/50"
                }`}
              >
                <BookOpen
                  className={`h-6 w-6 ${
                    role === "tutor"
                      ? "text-[#4169E1]"
                      : "text-muted-foreground"
                  }`}
                />

                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Tutor
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Teach students
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Division */}
          <div className="space-y-2">
            <label
              htmlFor="division"
              className="text-sm font-medium text-foreground"
            >
              Your Division
            </label>

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

              <select
                id="division"
                value={division}
                onChange={(event) => setDivision(event.target.value)}
                required
                disabled={submitting}
                className="w-full appearance-none rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-sm text-foreground outline-none transition focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20"
              >
                <option value="" disabled>
                  Select your division
                </option>

                {BANGLADESH_DIVISIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4169E1] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2748A5] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Saving Profile...
              </>
            ) : (
              "Complete Setup"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}