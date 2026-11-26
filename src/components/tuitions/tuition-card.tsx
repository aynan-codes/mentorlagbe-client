"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  MapPin,
  CalendarDays,
  GraduationCap,
  ArrowRight,
  Bookmark,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import type { Tuition } from "@/types/tuition.types";
import { useSession } from "@/lib/auth-client";
import {
  addBookmark,
  removeBookmark,
} from "@/services/bookmark.service";

interface TuitionCardProps {
  tuition: Tuition;
  initiallyBookmarked?: boolean;
  onBookmarkChange?: (tuitionId: string) => void;
}

const subjectImages: Record<string, string> = {
  mathematics:
    "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80",

  biology:
    "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80",

  chemistry:
    "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80",

  physics:
    "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",

  english:
    "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80",

  bangla:
    "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=800&q=80",

  ict:
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",

  "general science":
    "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80",

  "higher mathematics":
    "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80",

  geography:
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",

  "all subjects":
    "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80",

  "bangladesh and global studies":
    "https://images.unsplash.com/photo-1524666041070-9b8768338538?w=800&q=80",

  "social science":
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",

  accounting:
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",

  economics:
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",

  "finance and banking":
    "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",

  "business entrepreneurship":
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",

  "islam and moral education":
    "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=800&q=80",

  "physical education":
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80",

  agriculture:
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",

  "home science":
    "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80",
};

const defaultImage =
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80";

function getSubjectImage(subject: string) {
  return subjectImages[subject.toLowerCase().trim()] || defaultImage;
}

export function TuitionCard({
  tuition,
  initiallyBookmarked = false,
  onBookmarkChange,
}: TuitionCardProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const [isBookmarked, setIsBookmarked] = useState(initiallyBookmarked);
  const [isLoading, setIsLoading] = useState(false);

  const bannerImage =
    tuition.bannerImage?.trim() || getSubjectImage(tuition.subject);

  const userRole = (
    session?.user as { role?: string } | undefined
  )?.role;

  const handleBookmark = async () => {
    if (!session?.user) {
      toast.error("Please sign in to save this tuition.");
      router.push("/sign-in");
      return;
    }

    if (userRole !== "student") {
      toast.error("Only students can bookmark tuitions.");
      return;
    }

    try {
      setIsLoading(true);

      if (isBookmarked) {
        await removeBookmark(tuition._id);

        setIsBookmarked(false);

        // Notify parent page after successful removal
        onBookmarkChange?.(tuition._id);

        toast.success("Bookmark removed successfully.");
      } else {
        await addBookmark(tuition._id);

        setIsBookmarked(true);

        toast.success("Tuition saved successfully.");
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong.";

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-40 overflow-hidden bg-primary/10">
        <Image
          src={bannerImage}
          alt={tuition.title}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, 50vw"
          onError={(event) => {
            const image = event.currentTarget;

            image.onerror = null;
            image.src = getSubjectImage(tuition.subject);
          }}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <span className="absolute right-3 top-3 rounded-full bg-background/95 px-3 py-1 text-xs font-semibold capitalize text-primary">
          {tuition.mode}
        </span>

        <button
          type="button"
          onClick={handleBookmark}
          disabled={isLoading}
          aria-label={
            isBookmarked ? "Remove bookmark" : "Add bookmark"
          }
          title={isBookmarked ? "Remove bookmark" : "Save tuition"}
          className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/95 text-primary shadow transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-60"
        >
          {isLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Bookmark
              size={18}
              fill={isBookmarked ? "currentColor" : "none"}
            />
          )}
        </button>
      </div>

      <div className="p-5">
        <p className="mb-2 text-sm font-medium text-primary">
          {tuition.subject}
        </p>

        <h3 className="line-clamp-1 text-lg font-bold text-foreground">
          {tuition.title}
        </h3>

        <div className="mt-4 space-y-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <GraduationCap size={17} />
            <span>{tuition.classLevel}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin size={17} />
            <span>
              {tuition.location || "Location not specified"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays size={17} />
            <span>{tuition.daysPerWeek} Days / Week</span>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <div>
            <p className="text-xs text-muted-foreground">
              Monthly Salary
            </p>

            <p className="text-xl font-bold text-primary">
              ৳{tuition.monthlyFee.toLocaleString("en-BD")}
            </p>
          </div>

          <Link
            href={`/tuitions/${tuition._id}`}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Details
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}