"use client";

import { useState, type ReactNode } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import DashboardHeader from "@/components/dashboard/dashboard-header";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A]">
      {/* Desktop Sticky Sidebar */}
      <div className="sticky top-0 hidden h-screen shrink-0 self-start overflow-y-auto lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="absolute inset-0 bg-black/50"
          />

          <div className="relative h-full w-72 max-w-[85vw]">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white px-6 py-4 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
          © {new Date().getFullYear()} MentorLagbe. All rights reserved.
        </footer>
      </div>
    </div>
  );
}