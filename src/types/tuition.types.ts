export type TuitionStatus = "pending" | "approved" | "rejected";

export type TuitionMode = "online" | "offline" | "both";

export interface Tuition {
  _id: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: TuitionMode;
  location: string;
  monthlyFee: number;
  daysPerWeek: number;
  bannerImage: string;
  description: string;

  tutorName: string;
  tutorEmail: string;

  approvalStatus: TuitionStatus;
  isActive: boolean;

  isSeedData?: boolean;

  createdAt: string;
  updatedAt?: string;
}

export interface TuitionFilters {
  search?: string;
  subject?: string;
  class?: string;
  mode?: TuitionMode;
  location?: string;
  sortBy?: "newest" | "price-asc" | "price-desc";
  page?: number;
  limit?: number;
}

export interface TuitionListResponse {
  tuitions: Tuition[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}