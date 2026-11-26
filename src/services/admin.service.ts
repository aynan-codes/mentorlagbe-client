import apiClient from "@/lib/api-client";

// Types
export interface AdminTuition {
  _id: string;
  title: string;
  subject: string;
  classLevel: string;
  location: string;
  monthlyFee: number;
  tutorName: string;
  tutorEmail: string;
  approvalStatus: "pending" | "approved" | "rejected";
  isActive: boolean;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "student" | "tutor" | "admin";
  plan?: "free" | "pro";
  image?: string;
  createdAt?: string;
}

export interface AdminTransaction {
  _id: string;
  userEmail: string;
  userName: string;
  userRole: "student" | "tutor";
  planName: "pro";
  amount: number;
  currency: string;
  transactionId: string;
  stripeSessionId: string;
  paymentStatus: "paid" | "pending" | "failed";
  paidAt: string;
}

// API Response Types
interface AdminTuitionResponse {
  success: boolean;
  total: number;
  tuitions: AdminTuition[];
}

interface AdminUserResponse {
  success: boolean;
  total: number;
  users: AdminUser[];
}

interface AdminTransactionResponse {
  success: boolean;
  total: number;
  transactions: AdminTransaction[];
}

interface AdminActionResponse {
  success: boolean;
  message: string;
}

// Get Pending Tuitions
export const getPendingTuitions = async (): Promise<AdminTuition[]> => {
  const response = await apiClient.get<AdminTuitionResponse>(
    "/admin/tuitions/pending"
  );

  if (!response.data.success) {
    throw new Error("Failed to retrieve pending tuitions.");
  }

  return response.data.tuitions || [];
};

// Get All Tuitions
export const getAllTuitions = async (): Promise<AdminTuition[]> => {
  const response = await apiClient.get<AdminTuitionResponse>(
    "/admin/tuitions"
  );

  if (!response.data.success) {
    throw new Error("Failed to retrieve all tuitions.");
  }

  return response.data.tuitions || [];
};

// Approve or Reject Tuition
export const updateTuitionApproval = async (
  id: string,
  approvalStatus: "approved" | "rejected"
): Promise<string> => {
  const response = await apiClient.patch<AdminActionResponse>(
    `/admin/tuitions/${id}/approval`,
    { approvalStatus }
  );

  if (!response.data.success) {
    throw new Error("Failed to update tuition approval.");
  }

  return response.data.message;
};

// Get All Users
export const getAllUsers = async (): Promise<AdminUser[]> => {
  const response = await apiClient.get<AdminUserResponse>(
    "/admin/users"
  );

  if (!response.data.success) {
    throw new Error("Failed to retrieve users.");
  }

  return response.data.users || [];
};

// Update User Role
export const updateUserRole = async (
  id: string,
  role: "student" | "tutor" | "admin"
): Promise<string> => {
  const response = await apiClient.patch<AdminActionResponse>(
    `/admin/users/${id}/role`,
    { role }
  );

  if (!response.data.success) {
    throw new Error("Failed to update user role.");
  }

  return response.data.message;
};

// Get All Transactions
export const getAllTransactions =
  async (): Promise<AdminTransaction[]> => {
    const response = await apiClient.get<AdminTransactionResponse>(
      "/admin/transactions"
    );

    if (!response.data.success) {
      throw new Error("Failed to retrieve transactions.");
    }

    return response.data.transactions || [];
  };