import TransactionTable from "@/components/dashboard/admin/transaction-table";

export default function AdminTransactionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Payment Transactions
        </h1>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          View subscription payments and monitor platform revenue.
        </p>
      </div>

      <TransactionTable />
    </div>
  );
}