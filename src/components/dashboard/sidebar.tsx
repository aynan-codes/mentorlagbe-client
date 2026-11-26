"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  Users,
  CreditCard,
  Settings,
  Home,
  GraduationCap,
  ClipboardList,
  Clock,
  X,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import type { ElementType } from "react";

interface SidebarProps {
  onClose?: () => void;
}

interface NavigationItem {
  label: string;
  href: string;
  icon: ElementType;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const user = session?.user as
    | {
        role?: string;
        name?: string;
        email?: string;
      }
    | undefined;

  const role = user?.role;

  const navigation: Record<string, NavigationItem[]> = {
    admin: [
      {
        label: "Overview",
        href: "/dashboard/admin",
        icon: LayoutDashboard,
      },
      {
        label: "All Tuitions",
        href: "/dashboard/admin/all-tuitions",
        icon: BookOpen,
      },
      {
        label: "Pending Tuitions",
        href: "/dashboard/admin/pending-tuitions",
        icon: Clock,
      },
      {
        label: "Users",
        href: "/dashboard/admin/users",
        icon: Users,
      },
      {
        label: "Transactions",
        href: "/dashboard/admin/transactions",
        icon: CreditCard,
      },
    ],

    tutor: [
      {
        label: "Overview",
        href: "/dashboard/tutor",
        icon: LayoutDashboard,
      },
      {
        label: "Add Tuition",
        href: "/dashboard/tutor/add-tuition",
        icon: PlusCircle,
      },
      {
        label: "My Tuitions",
        href: "/dashboard/tutor/my-tuitions",
        icon: BookOpen,
      },
      {
        label: "Applicants",
        href: "/dashboard/tutor/applicants",
        icon: ClipboardList,
      },
      {
        label: "Payments",
        href: "/dashboard/tutor/payments",
        icon: CreditCard,
      },
    ],

    student: [
      {
        label: "Overview",
        href: "/dashboard/student",
        icon: LayoutDashboard,
      },
      {
        label: "My Applications",
        href: "/dashboard/student/applications",
        icon: ClipboardList,
      },
      {
        label: "Saved Tuitions",
        href: "/dashboard/student/saved-tuitions",
        icon: BookOpen,
      },
      {
        label: "Payments",
        href: "/dashboard/student/payments",
        icon: CreditCard,
      },
    ],
  };

  const items = role ? navigation[role] || [] : [];

  // Active Navigation
  const isActive = (href: string) => {
    const isDashboardOverview = /^\/dashboard\/(admin|student|tutor)$/.test(
      href
    );

    // Overview will only be active on its exact route.
    if (isDashboardOverview) {
      return pathname === href;
    }

    // Profile Settings will only be active on its exact route.
    if (href === "/dashboard/profile") {
      return pathname === href;
    }

    // Other navigation items support nested routes.
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleSignOut = async () => {
    try {
      await signOut();

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

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0F172A]">
      {/* Brand Header */}
      <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-slate-100 px-5 dark:border-slate-800">
        <Link
          href="/"
          onClick={onClose}
          className="group flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#4169E1] shadow-md shadow-blue-500/20 transition-transform group-hover:scale-105">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>

          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Mentor
              <span className="text-[#4169E1]">Lagbe</span>
            </h2>

            <p className="text-[10px] font-medium uppercase tracking-[2px] text-slate-400">
              Learning Platform
            </p>
          </div>
        </Link>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* User Profile Card */}
      <div className="px-4 pt-6">
        <div className="rounded-2xl border border-[#E0EAFF] bg-[#F8FAFF] p-4 dark:border-slate-700 dark:bg-slate-900/70">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#4169E1] text-sm font-bold text-white shadow-sm">
              {getInitials(user?.name)}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                {user?.name || "User"}
              </p>

              <p className="mt-1 text-xs capitalize text-slate-500 dark:text-slate-400">
                {role || "Account"}
              </p>
            </div>

            <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-green-500 ring-4 ring-green-100 dark:ring-green-900/30" />
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-[#E0EAFF] pt-3 dark:border-slate-700">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Account Status
            </span>

            <span className="rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-7">
        <div className="mb-4 flex items-center justify-between px-3">
          <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-slate-400">
            Main Menu
          </p>

          <span className="rounded-md bg-[#E0EAFF] px-2 py-0.5 text-[10px] font-bold text-[#2748A5] dark:bg-slate-800 dark:text-blue-300">
            {items.length}
          </span>
        </div>

        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              aria-current={active ? "page" : undefined}
              className={`group relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-[13px] font-semibold transition-all duration-200 ${
                active
                  ? "bg-[#4169E1] text-white shadow-md shadow-blue-500/20"
                  : "text-slate-600 hover:bg-[#E0EAFF] hover:text-[#2748A5] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              }`}
            >
              <Icon
                className={`h-[19px] w-[19px] shrink-0 transition-transform duration-200 ${
                  active
                    ? "text-white"
                    : "text-slate-400 group-hover:scale-110 group-hover:text-[#4169E1] dark:text-slate-500"
                }`}
              />

              <span className="flex-1">{item.label}</span>

              {active ? (
                <ChevronRight className="h-4 w-4 text-white/80" />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-transparent transition group-hover:bg-[#4169E1]" />
              )}
            </Link>
          );
        })}

        {/* Other Links */}
        <div className="my-6 border-t border-slate-100 dark:border-slate-800" />

        <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[1.5px] text-slate-400">
          Preferences
        </p>

        <Link
          href="/dashboard/profile"
          onClick={onClose}
          aria-current={
            isActive("/dashboard/profile") ? "page" : undefined
          }
          className={`group flex items-center gap-3 rounded-xl px-3.5 py-3 text-[13px] font-semibold transition-all duration-200 ${
            isActive("/dashboard/profile")
              ? "bg-[#4169E1] text-white shadow-md shadow-blue-500/20"
              : "text-slate-600 hover:bg-[#E0EAFF] hover:text-[#2748A5] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          }`}
        >
          <Settings
            className={`h-[19px] w-[19px] ${
              isActive("/dashboard/profile")
                ? "text-white"
                : "text-slate-400 group-hover:text-[#4169E1]"
            }`}
          />

          <span className="flex-1">Profile Settings</span>

          <ChevronRight className="h-4 w-4 opacity-50" />
        </Link>

        <Link
          href="/"
          onClick={onClose}
          className="group flex items-center gap-3 rounded-xl px-3.5 py-3 text-[13px] font-semibold text-slate-600 transition-all duration-200 hover:bg-[#E0EAFF] hover:text-[#2748A5] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <Home className="h-[19px] w-[19px] text-slate-400 group-hover:text-[#4169E1]" />

          <span className="flex-1">Back to Website</span>

          <ChevronRight className="h-4 w-4 opacity-50" />
        </Link>
      </nav>

      {/* Sign Out */}
      <div className="shrink-0 border-t border-slate-100 p-4 dark:border-slate-800">
        <button
          type="button"
          onClick={handleSignOut}
          className="group flex w-full items-center gap-3 rounded-xl border border-red-100 bg-red-50/70 px-4 py-3 text-[13px] font-semibold text-red-600 transition-all duration-200 hover:border-red-200 hover:bg-red-100 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40"
        >
          <LogOut className="h-[19px] w-[19px] transition-transform group-hover:-translate-x-1" />

          <span>Sign Out</span>
        </button>

        <p className="mt-4 text-center text-[10px] font-medium text-slate-400">
          MentorLagbe Dashboard
        </p>
      </div>
    </aside>
  );
}