import Link from "next/link";
import { Suspense } from "react";

import { getAllTuitions } from "@/services/tuition.service";
import { TuitionGrid } from "@/components/tuitions/tuition-grid";
import { TuitionSearch } from "@/components/tuitions/tuition-search";
import { TuitionFilters } from "@/components/tuitions/tuition-filters";
import type { Tuition } from "@/types/tuition.types";

export const instant = false;

const ITEMS_PER_PAGE = 12;

interface TuitionsPageProps {
  searchParams: Promise<{
    search?: string;
    subject?: string;
    class?: string;
    mode?: "online" | "offline" | "both";
    location?: string;
    sortBy?: "newest" | "price-asc" | "price-desc";
    page?: string;
  }>;
}

export default async function TuitionsPage({
  searchParams,
}: TuitionsPageProps) {
  const params = await searchParams;

  let tuitions: Tuition[] = [];
  let total = 0;
  let hasError = false;

  const currentPage = Math.max(1, Number(params.page) || 1);

  try {
    const result = await getAllTuitions({
      search: params.search,
      subject: params.subject,
      class: params.class,
      mode: params.mode,
      location: params.location,
      sortBy: params.sortBy ?? "newest",
      page: currentPage,
      limit: ITEMS_PER_PAGE,
    });

    tuitions = result.tuitions;
    total = result.total;
  } catch (error) {
    console.error("Tuition Page Error:", error);
    hasError = true;
  }

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  // Preserve existing search and filter parameters during pagination.
  const getPageHref = (page: number) => {
    const queryParams = new URLSearchParams();

    if (params.search) queryParams.set("search", params.search);
    if (params.subject) queryParams.set("subject", params.subject);
    if (params.class) queryParams.set("class", params.class);
    if (params.mode) queryParams.set("mode", params.mode);
    if (params.location) queryParams.set("location", params.location);

    if (params.sortBy && params.sortBy !== "newest") {
      queryParams.set("sortBy", params.sortBy);
    }

    queryParams.set("page", String(page));

    return `/tuitions?${queryParams.toString()}`;
  };

  return (
    <section className="min-h-screen bg-background px-4 py-16">
      <div className="mx-auto max-w-7xl">
        {/* Page Heading */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Explore All Tuitions
          </h1>

          <p className="mt-3 text-muted-foreground">
            Find the perfect tuition opportunity for your learning journey.
          </p>

          {!hasError && (
            <p className="mt-3 text-sm font-medium text-primary">
              {total} Tuitions Available
            </p>
          )}
        </div>

        {!hasError ? (
          <>
            {/* Search */}
            <div className="mb-6">
              <Suspense
                fallback={
                  <div className="h-14 animate-pulse rounded-xl bg-muted" />
                }
              >
                <TuitionSearch />
              </Suspense>
            </div>

            {/* Filters */}
            <div className="mb-8">
              <Suspense
                fallback={
                  <div className="h-32 animate-pulse rounded-2xl bg-muted" />
                }
              >
                <TuitionFilters />
              </Suspense>
            </div>

            {/* Tuition Results */}
            <TuitionGrid tuitions={tuitions} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col items-center gap-5">
                <p className="text-sm text-muted-foreground">
                  Showing page {currentPage} of {totalPages}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  {/* Previous Button */}
                  {currentPage > 1 ? (
                    <Link
                      href={getPageHref(currentPage - 1)}
                      className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-white"
                    >
                      Previous
                    </Link>
                  ) : (
                    <span className="cursor-not-allowed rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground opacity-50">
                      Previous
                    </span>
                  )}

                  {/* Page Numbers */}
                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((page) => (
                    <Link
                      key={page}
                      href={getPageHref(page)}
                      aria-current={currentPage === page ? "page" : undefined}
                      className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-semibold transition-colors ${
                        currentPage === page
                          ? "border-primary bg-primary text-white"
                          : "border-border text-foreground hover:border-primary hover:bg-accent"
                      }`}
                    >
                      {page}
                    </Link>
                  ))}

                  {/* Next Button */}
                  {currentPage < totalPages ? (
                    <Link
                      href={getPageHref(currentPage + 1)}
                      className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-white"
                    >
                      Next
                    </Link>
                  ) : (
                    <span className="cursor-not-allowed rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground opacity-50">
                      Next
                    </span>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-2xl border border-border p-10 text-center">
            <h2 className="text-xl font-bold text-foreground">
              Unable to Load Tuitions
            </h2>

            <p className="mt-3 text-sm text-muted-foreground">
              Please make sure the backend server is running and try again.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}