export default function DashboardLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-[#4169E1]" />

        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
          Loading dashboard...
        </p>
      </div>
    </div>
  );
}