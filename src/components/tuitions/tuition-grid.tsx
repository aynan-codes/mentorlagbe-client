import { BookOpen } from "lucide-react";

import { TuitionCard } from "@/components/tuitions/tuition-card";
import type { Tuition } from "@/types/tuition.types";

interface TuitionGridProps {
  tuitions: Tuition[];
}

export function TuitionGrid({ tuitions }: TuitionGridProps) {
  if (tuitions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border py-16 text-center">
        <BookOpen className="mx-auto mb-4 text-muted-foreground" size={40} />

        <h3 className="text-lg font-semibold text-foreground">
          No Tuitions Found
        </h3>

        <p className="mt-2 text-sm text-muted-foreground">
          No approved and active tuition is available right now.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {tuitions.map((tuition) => (
        <TuitionCard key={tuition._id} tuition={tuition} />
      ))}
    </div>
  );
}