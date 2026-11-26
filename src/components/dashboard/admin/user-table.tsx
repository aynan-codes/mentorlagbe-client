"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Users,
  Loader2,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  Search,
} from "lucide-react";

import { toast } from "sonner";

import {
  getAllUsers,
  updateUserRole,
  type AdminUser,
} from "@/services/admin.service";

type UserRole = "student" | "tutor" | "admin";

export default function UserTable() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const loadUsers = useCallback(async (showSuccessToast = false) => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllUsers();
      setUsers(data);

      if (showSuccessToast) {
        toast.success("Users refreshed successfully.");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load users.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  // Search and Role Filtering
  const filteredUsers = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        (user.name || "").toLowerCase().includes(searchValue) ||
        (user.email || "").toLowerCase().includes(searchValue);

      const matchesRole =
        roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  // Update User Role
  const handleRoleChange = async (
    user: AdminUser,
    role: UserRole
  ) => {
    if (user.role === role) return;

    const confirmed = window.confirm(
      `Are you sure you want to change ${user.name}'s role to ${role}?`
    );

    if (!confirmed) return;

    try {
      setProcessingId(user.id);

      const message = await updateUserRole(user.id, role);

      setUsers((previous) =>
        previous.map((item) =>
          item.id === user.id ? { ...item, role } : item
        )
      );

      toast.success(message || "User role updated successfully.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update user role."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // Role Badge
  const getRoleBadge = (role: string) => {
    const styles = {
      student:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      tutor:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      admin:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    };

    return (
      styles[role as keyof typeof styles] ||
      "bg-slate-100 text-slate-700"
    );
  };

  // Format Date
  const formatDate = (date?: string) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString();
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex min-h-60 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#4169E1]" />
        <span className="ml-3 text-sm text-slate-500">
          Loading users...
        </span>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/30">
        <AlertCircle className="mx-auto h-8 w-8 text-red-500" />

        <p className="mt-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>

        <button
          onClick={() => void loadUsers()}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#4169E1] px-4 py-2 text-sm font-medium text-white hover:bg-[#2748A5]"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            All Users
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            View users and manage their platform roles.
          </p>
        </div>

        <button
          onClick={() => void loadUsers(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <Users className="h-6 w-6 text-[#4169E1]" />

          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Total Users
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            {users.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <GraduationCap className="h-6 w-6 text-purple-500" />

          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Tutors
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            {users.filter((user) => user.role === "tutor").length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <BookOpen className="h-6 w-6 text-emerald-500" />

          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Students
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            {users.filter((user) => user.role === "student").length}
          </p>
        </div>
      </div>

      {/* Search and Role Filter */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or email..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#4169E1] dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(event) => setRoleFilter(event.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#4169E1] dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        >
          <option value="all">All Roles</option>
          <option value="student">Students</option>
          <option value="tutor">Tutors</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 p-5 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Users Management
          </h3>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="mx-auto h-12 w-12 text-slate-400" />

            <p className="mt-4 font-medium text-slate-700 dark:text-slate-300">
              No users found.
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or role filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-4">User</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4">Plan</th>
                  <th className="px-5 py-4">Joined</th>
                  <th className="px-5 py-4">Manage Role</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    {/* User Information */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={user.image}
                            alt={user.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E0EAFF] font-bold text-[#2748A5]">
                            {user.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                        )}

                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {user.name}
                          </p>

                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getRoleBadge(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>

                    {/* Plan */}
                    <td className="px-5 py-4">
                      <span className="font-medium capitalize text-slate-700 dark:text-slate-300">
                        {user.plan || "free"}
                      </span>
                    </td>

                    {/* Joined Date */}
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                      {formatDate(user.createdAt)}
                    </td>

                    {/* Manage Role */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <select
                          value={user.role}
                          disabled={processingId !== null}
                          onChange={(event) =>
                            handleRoleChange(
                              user,
                              event.target.value as UserRole
                            )
                          }
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-[#4169E1] disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        >
                          <option value="student">Student</option>
                          <option value="tutor">Tutor</option>
                          <option value="admin">Admin</option>
                        </select>

                        {processingId === user.id && (
                          <Loader2 className="h-4 w-4 animate-spin text-[#4169E1]" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Permission Notice */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <ShieldCheck className="h-4 w-4 text-[#4169E1]" />
        Only administrators can manage user roles.
      </div>
    </section>
  );
}