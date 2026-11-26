"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  UserPlus,
  GraduationCap,
  BookOpen,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";

import {
  signUpWithEmail,
  signInWithGoogle,
  type UserRole,
} from "@/services/auth.service";

import { BANGLADESH_DIVISIONS } from "@/lib/locations";

export default function SignUpForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [division, setDivision] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Email Sign Up
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !password || !division) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);

      await signUpWithEmail({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        division,
      });

      toast.success("Account created successfully!");

      router.replace(
        role === "tutor"
          ? "/dashboard/tutor"
          : "/dashboard/student"
      );

      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to create your account.";

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Google Sign Up
  const handleGoogleSignUp = async () => {
    if (!division) {
      toast.error("Please select your division first.");
      return;
    }

    try {
      setIsLoading(true);

      // Save selected role and division before Google redirect
      sessionStorage.setItem(
        "mentorlagbe_google_onboarding",
        JSON.stringify({
          role,
          division,
        })
      );

      await signInWithGoogle({
        role,
        division,
      });
    } catch (error) {
      sessionStorage.removeItem("mentorlagbe_google_onboarding");

      const message =
        error instanceof Error
          ? error.message
          : "Google sign up failed.";

      toast.error(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4169E1]/10">
          <UserPlus className="h-7 w-7 text-[#4169E1]" />
        </div>

        <h1 className="text-3xl font-bold text-foreground">
          Create Account
        </h1>

        <p className="text-sm text-muted-foreground">
          Join MentorLagbe and get started today.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full Name */}
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="text-sm font-medium text-foreground"
          >
            Full Name
          </label>

          <div className="relative">
            <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Enter your full name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              disabled={isLoading}
              className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-sm text-foreground outline-none transition focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-foreground"
          >
            Email Address
          </label>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={isLoading}
              className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-sm text-foreground outline-none transition focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20"
            />
          </div>
        </div>

        {/* Account Role */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Register As
          </label>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("student")}
              disabled={isLoading}
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                role === "student"
                  ? "border-[#4169E1] bg-[#4169E1]/10 ring-1 ring-[#4169E1]"
                  : "border-border bg-background hover:border-[#4169E1]/50"
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
              onClick={() => setRole("tutor")}
              disabled={isLoading}
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                role === "tutor"
                  ? "border-[#4169E1] bg-[#4169E1]/10 ring-1 ring-[#4169E1]"
                  : "border-border bg-background hover:border-[#4169E1]/50"
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
              disabled={isLoading}
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

        {/* Password */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-foreground"
          >
            Password
          </label>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
              disabled={isLoading}
              className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-12 text-sm text-foreground outline-none transition focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword((previous) => !previous)
              }
              disabled={isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          <p className="text-xs text-muted-foreground">
            Password must contain at least 8 characters.
          </p>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-foreground"
          >
            Confirm Password
          </label>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              required
              disabled={isLoading}
              className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-sm text-foreground outline-none transition focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4169E1] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2748A5] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Creating Account...
            </>
          ) : (
            <>
              <UserPlus className="h-5 w-5" />
              Create Account
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center">
        <div className="flex-grow border-t border-border" />
        <span className="px-3 text-xs text-muted-foreground">
          OR CONTINUE WITH
        </span>
        <div className="flex-grow border-t border-border" />
      </div>

      {/* Google Sign Up */}
      <button
        type="button"
        onClick={handleGoogleSignUp}
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <svg viewBox="0 0 48 48" className="h-5 w-5">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 3.05 13.22l7.98 6.19C12.7 13.72 17.87 9.5 24 9.5Z"
              transform="translate(0 4)"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.75 7.18l7.73 6C44.42 38.01 46.98 31.89 46.98 24.55Z"
            />
            <path
              fill="#FBBC05"
              d="M10.03 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a24 24 0 0 0 0 21.56l7.98-6.19Z"
              transform="translate(0 4)"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.89 2.3-8.18 2.3-6.13 0-11.3-4.22-12.97-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
            />
          </svg>
        )}

        Continue with Google
      </button>

      {/* Sign In Link */}
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-semibold text-[#4169E1] hover:underline"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}