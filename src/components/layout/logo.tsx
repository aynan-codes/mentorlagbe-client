import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <GraduationCap size={25} />
      </div>

      <span className="text-xl font-bold tracking-tight text-foreground">
        Mentor<span className="text-primary">Lagbe</span>
      </span>
    </Link>
  );
}