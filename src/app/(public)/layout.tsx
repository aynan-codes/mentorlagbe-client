import type { ReactNode } from "react";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Navbar />

      <main className="min-h-screen flex-1">
        {children}
      </main>

      <Footer />
    </>
  );
}