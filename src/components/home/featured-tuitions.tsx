import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  GraduationCap,
  MapPin,
  Monitor,
  UserRound,
  Sparkles,
  Clock,
} from "lucide-react";

import { getFeaturedTuitions } from "@/services/tuition.service";
import type { Tuition } from "@/types/tuition.types";

const fallbackImages: Record<string, string> = {
  Mathematics:
    "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=85",
  English:
    "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=85",
  Physics:
    "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&q=85",
  Chemistry:
    "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=85",
  Biology:
    "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&q=85",
  ICT: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=85",
};

const getBannerImage = (tuition: Tuition) => {
  return (
    tuition.bannerImage ||
    fallbackImages[tuition.subject] ||
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=85"
  );
};

export async function FeaturedTuitions() {
  let featuredTuitions: Tuition[] = [];
  let hasError = false;

  try {
    featuredTuitions = await getFeaturedTuitions();
  } catch (error) {
    console.error("Featured Tuitions Error:", error);
    hasError = true;
  }

  return (
    <section className="relative overflow-hidden bg-background px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              <Sparkles size={17} />
              Explore Opportunities
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Featured
              <span className="text-primary"> Tuitions</span>
            </h2>

            <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
              Discover the latest tuition opportunities and find the perfect
              learning match for your academic journey.
            </p>
          </div>

          <Link
            href="/tuitions"
            className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-6 text-sm font-bold text-primary transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/20"
          >
            View All Tuitions
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Tuition Cards */}
        {hasError ? (
          <div className="rounded-2xl border border-border bg-card px-6 py-14 text-center shadow-sm">
            <BookOpen className="mx-auto mb-4 text-primary" size={40} />

            <h3 className="font-bold text-foreground">
              Unable to load featured tuitions.
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Please try again later.
            </p>
          </div>
        ) : featuredTuitions.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card px-6 py-14 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <BookOpen size={32} />
            </div>

            <h3 className="text-xl font-bold text-foreground">
              No Featured Tuitions Available
            </h3>

            <p className="mt-3 text-sm text-muted-foreground">
              New tuition opportunities will appear here after approval.
            </p>

            <Link
              href="/tuitions"
              className="mt-6 inline-flex items-center gap-2 font-semibold text-primary hover:gap-3"
            >
              Explore Tuitions
              <ArrowRight size={17} />
            </Link>
          </div>
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTuitions.map((tuition) => (
              <article
                key={tuition._id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10"
              >
                {/* Banner Image */}
                <div className="relative h-48 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{
                      backgroundImage: `url("${getBannerImage(tuition)}")`,
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />

                  {/* Subject Badge */}
                  <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-md">
                    <BookOpen size={14} />
                    {tuition.subject}
                  </span>

                  {/* Available Badge */}
                  <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-emerald-500/95 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    Available
                  </span>
                </div>

                {/* Card Content */}
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  {/* Subject Information */}
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                      <GraduationCap size={23} />
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Subject
                      </p>

                      <p className="font-bold text-primary">
                        {tuition.subject}
                      </p>
                    </div>
                  </div>

                  {/* Tuition Title */}
                  <h3 className="mb-5 min-h-14 text-lg font-bold leading-7 text-card-foreground transition-colors group-hover:text-primary">
                    {tuition.title}
                  </h3>

                  {/* Tuition Information */}
                  <div className="flex flex-1 flex-col gap-4 border-b border-border pb-5 text-sm text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <GraduationCap
                        size={18}
                        className="shrink-0 text-primary"
                      />

                      <span>{tuition.classLevel}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {tuition.mode === "online" ? (
                        <Monitor
                          size={18}
                          className="shrink-0 text-primary"
                        />
                      ) : (
                        <MapPin
                          size={18}
                          className="shrink-0 text-primary"
                        />
                      )}

                      <span>
                        {tuition.mode === "online"
                          ? "Online"
                          : tuition.location || "Location not specified"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <CalendarDays
                        size={18}
                        className="shrink-0 text-primary"
                      />

                      <span>{tuition.daysPerWeek} Days/Week</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <UserRound
                        size={18}
                        className="shrink-0 text-primary"
                      />

                      <span>{tuition.tutorName}</span>
                    </div>
                  </div>

                  {/* Salary & Details */}
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Monthly Salary
                      </p>

                      <p className="mt-1 text-xl font-extrabold text-primary">
                        ৳{tuition.monthlyFee.toLocaleString("en-BD")}

                        <span className="ml-1 text-xs font-medium text-muted-foreground">
                          /month
                        </span>
                      </p>
                    </div>

                    <Link
                      href={`/tuitions/${tuition._id}`}
                      className="group/details inline-flex h-10 shrink-0 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white shadow-md shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-lg"
                    >
                      Details

                      <ArrowRight
                        size={15}
                        className="transition-transform group-hover/details:translate-x-1"
                      />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-14 rounded-2xl border border-primary/15 bg-primary/5 px-5 py-8 text-center sm:px-8">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Clock size={22} />
          </div>

          <h3 className="text-lg font-bold text-foreground">
            Looking for More Opportunities?
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Explore all available tuition opportunities and find your perfect
            match.
          </p>

          <Link
            href="/tuitions"
            className="mt-5 inline-flex items-center gap-2 font-bold text-primary transition-all hover:gap-3"
          >
            Explore All Tuitions
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}