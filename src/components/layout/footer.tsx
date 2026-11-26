"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  Code,
  BriefcaseBusiness,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { publicNavigation } from "@/constants/navigation";

function CurrentYear() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return <>{year ?? "2026"}</>;
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Logo />

            <p className="mt-4 max-w-xs text-sm leading-7 text-muted-foreground">
              MentorLagbe connects students with qualified tutors to make
              personalized learning easier and more accessible.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">
              Quick Links
            </h3>

            <ul className="space-y-3">
              {publicNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">
              Account
            </h3>

            <ul className="space-y-3">
              <li>
                <Link
                  href="/sign-in"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Sign In
                </Link>
              </li>

              <li>
                <Link
                  href="/sign-up"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Create Account
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">
              Contact Us
            </h3>

            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-center gap-3">
                <Mail size={18} className="shrink-0 text-primary" />
                <a
                  href="mailto:support@mentorlagbe.com"
                  className="transition-colors hover:text-primary"
                >
                  support@mentorlagbe.com
                </a>
              </li>

              <li className="flex items-center gap-3">
                <Phone size={18} className="shrink-0 text-primary" />
                <a
                  href="tel:+8801815230540"
                  className="transition-colors hover:text-primary"
                >
                  +8801815230540
                </a>
              </li>

              <li className="flex items-center gap-3">
                <MapPin size={18} className="shrink-0 text-primary" />
                <span>Bangladesh</span>
              </li>
            </ul>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3">
              <Link
                href="#"
                aria-label="GitHub"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Code size={19} />
              </Link>

              <Link
                href="#"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
              >
                <BriefcaseBusiness size={19} />
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-border pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © <CurrentYear /> MentorLagbe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}