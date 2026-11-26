import PendingTuitionTable from "@/components/dashboard/admin/pending-tuition-table";

export default function PendingTuitionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Pending Tuitions
        </h1>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Review tuition requests and approve or reject them.
        </p>
      </div>

      <PendingTuitionTable />
    </div>
  );
}