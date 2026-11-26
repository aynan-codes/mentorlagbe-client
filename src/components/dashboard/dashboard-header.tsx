"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { getMyProfile } from "@/services/user.service";
import {
  Menu,
  Bell,
  LogOut,
  Home,
  GraduationCap,
  Settings,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

interface DashboardHeaderProps {
  onMenuClick?: () => void;
}

export default function DashboardHeader({
  onMenuClick,
}: DashboardHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | undefined>();

  const user = session?.user as
    | {
        name?: string;
        email?: string;
        role?: string;
        image?: string | null;
      }
    | undefined;

  const userEmail = user?.email;

  // Fetch Profile Image
  useEffect(() => {
    let isMounted = true;

    const fetchProfileImage = async () => {
      if (!userEmail) {
        setProfileImage(undefined);
        return;
      }

      try {
        const profile = await getMyProfile();

        if (isMounted) {
          setProfileImage(profile?.image || undefined);
        }
      } catch (error) {
        console.error("Dashboard Profile Image Error:", error);
      }
    };

    fetchProfileImage();

    return () => {
      isMounted = false;
    };
  }, [userEmail, pathname]);

  const displayedImage = profileImage || user?.image || undefined;

  const handleSignOut = async () => {
    try {
      await signOut();

      setProfileImage(undefined);
      toast.success("Signed out successfully.");

      router.push("/sign-in");
      router.refresh();
    } catch {
      toast.error("Failed to sign out.");
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";

    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  // Reusable Profile Avatar
  const ProfileAvatar = ({
    size = "h-9 w-9",
  }: {
    size?: string;
  }) => {
    return displayedImage ? (
      <img
        src={displayedImage}
        alt={user?.name || "Profile"}
        className={`${size} shrink-0 rounded-lg object-cover`}
      />
    ) : (
      <div
        className={`flex ${size} shrink-0 items-center justify-center rounded-lg bg-[#4169E1] text-xs font-bold text-white shadow-sm`}
      >
        {getInitials(user?.name)}
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-30 flex h-[76px] shrink-0 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-xl sm:px-6 lg:px-8 dark:border-slate-800 dark:bg-[#0F172A]/95">
      {/* Left Section */}
      <div className="flex min-w-0 items-center gap-3">
        {/* Mobile Menu */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-[#4169E1] hover:bg-[#E0EAFF] hover:text-[#4169E1] lg:hidden dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Mobile Brand */}
        <Link href="/" className="flex items-center gap-2 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4169E1] shadow-sm">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>

          <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
            Mentor
            <span className="text-[#4169E1]">Lagbe</span>
          </span>
        </Link>

        {/* Desktop Page Heading */}
        <div className="hidden lg:block">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              Dashboard
            </h2>

            <span className="rounded-full bg-[#E0EAFF] px-2.5 py-1 text-[10px] font-bold text-[#2748A5] dark:bg-slate-800 dark:text-blue-300">
              {user?.role || "Account"}
            </span>
          </div>

          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Welcome back! Manage your MentorLagbe account.
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Visit Website */}
        <Link
          href="/"
          className="hidden items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-[#4169E1] hover:bg-[#E0EAFF] hover:text-[#2748A5] sm:flex dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <Home className="h-4 w-4" />
          Visit Website
        </Link>

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          title="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-[#4169E1] hover:bg-[#E0EAFF] hover:text-[#4169E1] dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Bell className="h-[19px] w-[19px]" />
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((previous) => !previous)}
            aria-expanded={menuOpen}
            aria-label="Open user menu"
            className={`flex items-center gap-2 rounded-xl border p-1.5 transition ${
              menuOpen
                ? "border-[#4169E1] bg-[#E0EAFF] dark:bg-slate-800"
                : "border-transparent hover:border-slate-200 hover:bg-slate-50 dark:hover:border-slate-700 dark:hover:bg-slate-800"
            }`}
          >
            <ProfileAvatar />

            <div className="hidden max-w-32 text-left sm:block">
              <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                {user?.name || "User"}
              </p>

              <p className="mt-0.5 text-[10px] capitalize text-slate-500 dark:text-slate-400">
                {user?.role || "Account"}
              </p>
            </div>

            <ChevronDown
              className={`hidden h-4 w-4 text-slate-400 transition-transform sm:block ${
                menuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <>
              <button
                type="button"
                aria-label="Close user menu"
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => setMenuOpen(false)}
              />

              <div className="absolute right-0 top-14 z-50 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900">
                {/* User Information */}
                <div className="border-b border-slate-100 bg-[#F8FAFF] p-4 dark:border-slate-800 dark:bg-slate-800/50">
                  <div className="flex items-center gap-3">
                    <ProfileAvatar size="h-11 w-11" />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                        {user?.name || "User"}
                      </p>

                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                        {user?.email || ""}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Profile */}
                <div className="p-2">
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-[#E0EAFF] hover:text-[#2748A5] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                  >
                    <Settings className="h-[18px] w-[18px] text-[#4169E1]" />
                    Profile Settings
                  </Link>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                  >
                    <LogOut className="h-[18px] w-[18px]" />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}