"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  X,
  UserCircle,
  LogOut,
} from "lucide-react";

import { publicNavigation } from "@/constants/navigation";
import { useSession, signOut } from "@/lib/auth-client";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const user = session?.user as
    | {
        name?: string;
        email?: string;
      }
    | undefined;

  const handleSignOut = async () => {
    await signOut();
    onClose();
    router.push("/sign-in");
    router.refresh();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute left-0 top-full z-50 w-full border-b border-border bg-background p-4 shadow-lg md:hidden">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-semibold text-foreground">Menu</span>

        <button
          onClick={onClose}
          aria-label="Close menu"
          className="rounded-md p-2 text-foreground hover:bg-muted"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex flex-col gap-1">
        {publicNavigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <Icon size={18} />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 border-t border-border pt-4">
        {session ? (
          <>
            <div className="mb-3 px-3">
              <p className="font-semibold text-foreground">
                {user?.name || "My Account"}
              </p>
              <p className="text-xs text-muted-foreground">
                {user?.email}
              </p>
            </div>

            <Link
              href="/dashboard/profile"
              onClick={onClose}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-foreground hover:bg-muted"
            >
              <UserCircle size={18} />
              Profile Settings
            </Link>

            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link
              href="/sign-in"
              onClick={onClose}
              className="block rounded-lg px-4 py-3 text-sm font-medium text-foreground hover:bg-muted"
            >
              Sign In
            </Link>

            <Link
              href="/sign-up"
              onClick={onClose}
              className="block rounded-lg bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </div>
  );
}