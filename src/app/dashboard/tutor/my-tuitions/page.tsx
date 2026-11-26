import MyTuitionsTable from "@/components/dashboard/tutor/my-tuitions-table";

export default function MyTuitionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          My Tuitions
        </h1>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Manage your tuition posts, update their status, and track admin approval.
        </p>
      </div>

      <MyTuitionsTable />
    </div>
  );
}