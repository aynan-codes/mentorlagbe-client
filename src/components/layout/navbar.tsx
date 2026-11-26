"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  UserCircle,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { publicNavigation } from "@/constants/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { getMyProfile } from "@/services/user.service";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | undefined>();

  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const user = session?.user as
    | {
        name?: string;
        email?: string;
        image?: string;
        role?: "admin" | "student" | "tutor";
      }
    | undefined;

  const userEmail = user?.email;

  const dashboardRoutes = {
    admin: "/dashboard/admin",
    student: "/dashboard/student",
    tutor: "/dashboard/tutor",
  };

  const dashboardHref = user?.role
    ? dashboardRoutes[user.role]
    : undefined;

  useEffect(() => {
    if (!userEmail) {
      setProfileImage(undefined);
      return;
    }

    let isMounted = true;

    // প্রথমে Google-এর ছবিটি দেখাবে
    setProfileImage(user?.image || undefined);

    // Database-এ আপলোড করা ছবি থাকলে সেটিকে অগ্রাধিকার দেবে
    getMyProfile()
      .then((profile) => {
        if (isMounted) {
          setProfileImage(profile.image || user?.image || undefined);
        }
      })
      .catch((error) => {
        console.error("Navbar Profile Fetch Error:", error);

        if (isMounted) {
          setProfileImage(user?.image || undefined);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [userEmail, user?.image, pathname]);

  const handleSignOut = async () => {
    await signOut();
    setIsProfileMenuOpen(false);
    setProfileImage(undefined);
    router.push("/sign-in");
    router.refresh();
  };

  const initials = (user?.name || user?.email || "U")
    .charAt(0)
    .toUpperCase();

  const displayedImage = profileImage || user?.image;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo />

        <nav className="hidden items-center gap-7 md:flex">
          {publicNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <div className="hidden items-center gap-3 sm:flex">
            {session ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setIsProfileMenuOpen(!isProfileMenuOpen)
                  }
                  className="flex items-center gap-2 rounded-full border border-border p-1.5 pr-3 transition-colors hover:bg-muted"
                >
                  {displayedImage ? (
                    <img
                      src={displayedImage}
                      alt={user?.name || "Profile"}
                      referrerPolicy="no-referrer"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {initials}
                    </div>
                  )}

                  <span className="max-w-28 truncate text-sm font-medium text-foreground">
                    {user?.name || "My Account"}
                  </span>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-border bg-background p-2 shadow-lg">
                    <div className="border-b border-border px-3 py-2">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {user?.name || "User"}
                      </p>

                      <p className="truncate text-xs text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>

                    {dashboardHref && (
                      <Link
                        href={dashboardHref}
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                      >
                        <LayoutDashboard size={17} />
                        Dashboard
                      </Link>
                    )}

                    <Link
                      href="/dashboard/profile"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                    >
                      <UserCircle size={17} />
                      Profile Settings
                    </Link>

                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <LogOut size={17} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors hover:bg-muted"
                >
                  Sign In
                </Link>

                <Link
                  href="/sign-up"
                  className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border transition-colors hover:bg-muted md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>
        </div>
      </div>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
}