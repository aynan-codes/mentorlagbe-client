import UserTable from "@/components/dashboard/admin/user-table";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          User Management
        </h1>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Manage platform users and update their roles.
        </p>
      </div>

      <UserTable />
    </div>
  );
}