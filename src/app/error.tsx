"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <AlertTriangle className="mb-4 h-16 w-16 text-red-500" />

      <h2 className="mb-2 text-2xl font-bold">
        Something went wrong!
      </h2>

      <p className="mb-6 max-w-md text-muted-foreground">
        An unexpected error occurred. Please try again.
      </p>

      <button
        onClick={() => reset()}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-primary-foreground hover:opacity-90"
      >
        <RefreshCw size={18} />
        Try Again
      </button>
    </div>
  );
}