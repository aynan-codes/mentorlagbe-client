import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon: LucideIcon;
  iconColor?: string;
}

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor = "text-[#4169E1]",
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {title}
        </p>

        <div className="rounded-lg bg-[#E0EAFF] p-2 dark:bg-slate-800">
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </div>

      <h3 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
        {value}
      </h3>

      {description && (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
}