export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-[#F8FAFC] dark:bg-[#0F172A]">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#E0EAFF] border-t-[#4169E1]" />

        <p className="mt-4 text-sm font-medium text-slate-600 dark:text-slate-300">
          Loading tuition details...
        </p>
      </div>
    </div>
  );
}