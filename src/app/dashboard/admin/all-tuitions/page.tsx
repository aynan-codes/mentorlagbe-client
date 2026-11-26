import AllTuitionsTable from "@/components/dashboard/admin/all-tuitions-table";

export default function AllTuitionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          All Tuitions
        </h1>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          View and monitor all tuition posts across the platform.
        </p>
      </div>

      <AllTuitionsTable />
    </div>
  );
}