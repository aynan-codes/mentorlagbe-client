"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

import { BANGLADESH_DIVISIONS } from "@/lib/locations";

const subjects = [
  "Mathematics",
  "English",
  "Bangla",
  "Physics",
  "Chemistry",
  "Biology",
  "ICT",
  "General Science",
  "Higher Mathematics",
  "Bangladesh and Global Studies",
  "Social Science",
  "Accounting",
  "Economics",
  "Finance and Banking",
  "Business Entrepreneurship",
  "Geography",
  "Islam and Moral Education",
  "Physical Education",
  "Agriculture",
  "Home Science",
  "All Subjects",
];

const classes = [
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "HSC",
];

export function TuitionFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("subject");
    params.delete("class");
    params.delete("mode");
    params.delete("location");
    params.delete("sortBy");
    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);
  };

  const hasFilters =
    searchParams.has("subject") ||
    searchParams.has("class") ||
    searchParams.has("mode") ||
    searchParams.has("location") ||
    searchParams.has("sortBy");

  const selectClass =
    "h-11 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none transition-colors focus:border-primary";

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={19} className="text-primary" />

          <h3 className="font-semibold text-foreground">
            Filter & Sort Tuitions
          </h3>
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-medium text-primary hover:underline"
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Division Filter */}
        <div>
          <label
            htmlFor="location-filter"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Division
          </label>

          <select
            id="location-filter"
            value={searchParams.get("location") || ""}
            onChange={(event) =>
              updateFilter("location", event.target.value)
            }
            className={selectClass}
          >
            <option value="">All Divisions</option>

            {BANGLADESH_DIVISIONS.map((division) => (
              <option key={division} value={division}>
                {division}
              </option>
            ))}
          </select>
        </div>

        {/* Subject Filter */}
        <div>
          <label
            htmlFor="subject-filter"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Subject
          </label>

          <select
            id="subject-filter"
            value={searchParams.get("subject") || ""}
            onChange={(event) =>
              updateFilter("subject", event.target.value)
            }
            className={selectClass}
          >
            <option value="">All Subjects (No Filter)</option>

            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject === "All Subjects"
                  ? "All Subjects Tuition"
                  : subject}
              </option>
            ))}
          </select>
        </div>

        {/* Class Filter */}
        <div>
          <label
            htmlFor="class-filter"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Class Level
          </label>

          <select
            id="class-filter"
            value={searchParams.get("class") || ""}
            onChange={(event) =>
              updateFilter("class", event.target.value)
            }
            className={selectClass}
          >
            <option value="">All Classes</option>

            {classes.map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>
        </div>

        {/* Tuition Mode Filter */}
        <div>
          <label
            htmlFor="mode-filter"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Tuition Mode
          </label>

          <select
            id="mode-filter"
            value={searchParams.get("mode") || ""}
            onChange={(event) =>
              updateFilter("mode", event.target.value)
            }
            className={selectClass}
          >
            <option value="">All Modes</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="both">Online & Offline</option>
          </select>
        </div>

        {/* Sorting */}
        <div>
          <label
            htmlFor="sort-filter"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Sort By
          </label>

          <select
            id="sort-filter"
            value={searchParams.get("sortBy") || "newest"}
            onChange={(event) =>
              updateFilter("sortBy", event.target.value)
            }
            className={selectClass}
          >
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  );
}