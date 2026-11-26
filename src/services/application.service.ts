import apiClient from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/constants";

export interface CreateApplicationPayload {
  tuitionId: string;
  studentPhone: string;
  preferredSchedule: string;
  studentNote: string;
}

export interface Application {
  _id: string;
  tuitionId: string;
  tuitionTitle: string;
  subject: string;
  monthlyFee: number;
  tutorEmail: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  preferredSchedule: string;
  studentNote: string;
  status: "pending" | "accepted" | "rejected";
  appliedAt: string;
}

interface ApplicationsResponse {
  success: boolean;
  total: number;
  applications: Application[];
}

interface SingleApplicationResponse {
  success: boolean;
  message: string;
  application: Application;
}

export const createApplication = async (
  payload: CreateApplicationPayload
): Promise<Application> => {
  const response = await apiClient.post<SingleApplicationResponse>(
    API_ENDPOINTS.APPLICATIONS.CREATE,
    payload
  );

  return response.data.application;
};

export const getMyApplications = async (): Promise<Application[]> => {
  const response = await apiClient.get<ApplicationsResponse>(
    API_ENDPOINTS.APPLICATIONS.MY_APPLICATIONS
  );

  return Array.isArray(response.data.applications)
    ? response.data.applications
    : [];
};

export const getTutorApplications = async (): Promise<Application[]> => {
  const response = await apiClient.get<ApplicationsResponse>(
    API_ENDPOINTS.APPLICATIONS.TUTOR_APPLICATIONS
  );

  return Array.isArray(response.data.applications)
    ? response.data.applications
    : [];
};

export const updateApplicationStatus = async (
  applicationId: string,
  status: "accepted" | "rejected"
): Promise<Application> => {
  const response = await apiClient.patch<SingleApplicationResponse>(
    API_ENDPOINTS.APPLICATIONS.UPDATE_STATUS(applicationId),
    { status }
  );

  return response.data.application;
};

export const cancelApplication = async (
  applicationId: string
): Promise<void> => {
  await apiClient.delete(
    API_ENDPOINTS.APPLICATIONS.CANCEL(applicationId)
  );
};