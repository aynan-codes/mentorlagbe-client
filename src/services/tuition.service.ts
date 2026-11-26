import apiClient from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/constants";

import type {
  Tuition,
  TuitionFilters,
  TuitionListResponse,
} from "@/types/tuition.types";

interface BackendTuitionResponse {
  success: boolean;
  total: number;
  currentPage: number;
  totalPages: number;
  tuitions: Tuition[];
}

export interface UpdateTuitionPayload {
  title?: string;
  subject?: string;
  classLevel?: string;
  mode?: "online" | "offline" | "both";
  location?: string;
  monthlyFee?: number;
  daysPerWeek?: number;
  bannerImage?: string;
  description?: string;
}

export interface CreateTuitionPayload {
  title: string;
  subject: string;
  classLevel: string;
  mode: "online" | "offline" | "both";
  location: string;
  monthlyFee: number;
  daysPerWeek: number;
  bannerImage: string;
  description: string;
}

interface TuitionActionResponse {
  success: boolean;
  message: string;
}

// Get All Approved Tuitions
export const getAllTuitions = async (
  filters: TuitionFilters = {}
): Promise<TuitionListResponse> => {
  const response = await apiClient.get<BackendTuitionResponse>(
    API_ENDPOINTS.TUITIONS.BASE,
    {
      params: {
        search: filters.search,
        subject: filters.subject,
        classLevel: filters.class,
        mode: filters.mode,
        location: filters.location,
        sortBy: filters.sortBy ?? "newest",
        page: filters.page ?? 1,
        limit: filters.limit ?? 12,
      },
    }
  );

  return {
    tuitions: response.data.tuitions,
    total: response.data.total,
    page: response.data.currentPage,
    limit: filters.limit ?? 12,
    totalPages: response.data.totalPages,
  };
};

// Get Featured Tuitions
export const getFeaturedTuitions = async (): Promise<Tuition[]> => {
  const result = await getAllTuitions({
    page: 1,
    limit: 6,
  });

  return result.tuitions;
};

// Get Single Tuition
export const getTuitionById = async (
  id: string
): Promise<Tuition> => {
  const response = await apiClient.get<{ tuition: Tuition }>(
    API_ENDPOINTS.TUITIONS.DETAILS(id)
  );

  return response.data.tuition;
};

// Get Logged-in Tutor's Tuitions
export const getMyTuitions = async (): Promise<Tuition[]> => {
  const response = await apiClient.get<{
    success: boolean;
    total: number;
    tuitions: Tuition[];
  }>("/tuitions/my-tuitions");

  if (!response.data.success) {
    throw new Error("Failed to retrieve your tuitions.");
  }

  return response.data.tuitions || [];
};

// Update Tuition
export const updateTuition = async (
  id: string,
  payload: UpdateTuitionPayload
): Promise<string> => {
  const response = await apiClient.patch<TuitionActionResponse>(
    `/tuitions/${id}`,
    payload
  );

  if (!response.data.success) {
    throw new Error(
      response.data.message || "Failed to update tuition."
    );
  }

  return response.data.message;
};

// Delete Tuition
export const deleteTuition = async (
  id: string
): Promise<string> => {
  const response = await apiClient.delete<TuitionActionResponse>(
    `/tuitions/${id}`
  );

  if (!response.data.success) {
    throw new Error(
      response.data.message || "Failed to delete tuition."
    );
  }

  return response.data.message;
};

// Update Tuition Active / Closed Status
export const updateTuitionStatus = async (
  id: string,
  isActive: boolean
): Promise<string> => {
  const response = await apiClient.patch<TuitionActionResponse>(
    `/tuitions/${id}/status`,
    { isActive }
  );

  if (!response.data.success) {
    throw new Error(
      response.data.message || "Failed to update tuition status."
    );
  }

  return response.data.message;
};

// Create New Tuition
export const createTuition = async (
  payload: CreateTuitionPayload
): Promise<string> => {
  const response = await apiClient.post<TuitionActionResponse>(
    "/tuitions",
    payload
  );

  if (!response.data.success) {
    throw new Error(
      response.data.message || "Failed to create tuition."
    );
  }

  return response.data.message;
};