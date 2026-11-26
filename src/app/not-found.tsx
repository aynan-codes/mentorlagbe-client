import Link from "next/link";
import { Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <SearchX className="mb-6 h-20 w-20 text-primary" />

      <h1 className="mb-3 text-5xl font-bold">404</h1>

      <h2 className="mb-3 text-2xl font-semibold">
        Page Not Found
      </h2>

      <p className="mb-8 max-w-md text-muted-foreground">
        Sorry, the page you are looking for does not exist or may have
        been moved.
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-primary-foreground transition-opacity hover:opacity-90"
      >
        <Home size={18} />
        Back to Home
      </Link>
    </div>
  );
}