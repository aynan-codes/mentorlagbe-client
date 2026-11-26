import apiClient from "@/lib/api-client";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "student" | "tutor" | "admin";
  division?: string;
  phone?: string;
  bio?: string;
  image?: string;
  plan?: "free" | "pro";
  onboardingCompleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfilePayload {
  name?: string;
  division?: string;
  phone?: string;
  bio?: string;
  image?: string;
}

export interface CompleteOnboardingPayload {
  role: "student" | "tutor";
  division: string;
}

interface ProfileResponse {
  success: boolean;
  message: string;
  user: UserProfile;
}

// Get logged-in user profile
export const getMyProfile = async (): Promise<UserProfile> => {
  const response = await apiClient.get<ProfileResponse>("/users/me");

  if (!response.data.success || !response.data.user) {
    throw new Error(response.data.message || "Failed to get profile.");
  }

  return response.data.user;
};

// Update logged-in user profile
export const updateMyProfile = async (
  payload: UpdateProfilePayload
): Promise<UserProfile> => {
  const response = await apiClient.patch<ProfileResponse>(
    "/users/me",
    payload
  );

  if (!response.data.success || !response.data.user) {
    throw new Error(response.data.message || "Failed to update profile.");
  }

  return response.data.user;
};

// Complete Google OAuth onboarding
export const completeGoogleOnboarding = async (
  payload: CompleteOnboardingPayload
): Promise<UserProfile> => {
  const response = await apiClient.patch<ProfileResponse>(
    "/users/complete-onboarding",
    payload
  );

  if (!response.data.success || !response.data.user) {
    throw new Error(
      response.data.message || "Failed to complete account setup."
    );
  }

  return response.data.user;
};