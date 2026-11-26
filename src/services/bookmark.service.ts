import apiClient from "@/lib/api-client";
import type { Tuition } from "@/types/tuition.types";

interface BookmarkResponse {
  success: boolean;
  total: number;
  tuitions: Tuition[];
}

export const getMyBookmarks = async (): Promise<Tuition[]> => {
  const response = await apiClient.get<BookmarkResponse>(
    "/bookmarks"
  );

  if (!response.data?.success) {
    throw new Error("Unable to retrieve saved tuitions.");
  }

  return response.data.tuitions || [];
};

export const addBookmark = async (
  tuitionId: string
): Promise<void> => {
  const response = await apiClient.post("/bookmarks", {
    tuitionId,
  });

  if (!response.data?.success) {
    throw new Error("Unable to bookmark tuition.");
  }
};

export const removeBookmark = async (
  tuitionId: string
): Promise<void> => {
  const response = await apiClient.delete(
    `/bookmarks/${tuitionId}`
  );

  if (!response.data?.success) {
    throw new Error("Unable to remove bookmark.");
  }
};