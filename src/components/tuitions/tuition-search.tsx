"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

export function TuitionSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    if (search.trim()) {
      params.set("search", search.trim());
    } else {
      params.delete("search");
    }

    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);
  };

  const clearSearch = () => {
    setSearch("");

    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 shadow-sm transition-colors focus-within:border-primary">
        <Search size={20} className="shrink-0 text-muted-foreground" />

        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by tuition title or subject..."
          className="h-10 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />

        {search && (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="Clear search"
            className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X size={18} />
          </button>
        )}

        <button
          type="submit"
          className="shrink-0 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Search
        </button>
      </div>
    </form>
  );
}