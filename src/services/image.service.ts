import apiClient from "@/lib/api-client";

interface ImageUploadResponse {
  success: boolean;
  message: string;
  imageUrl: string;
}

// Upload Image to ImgBB
export const uploadImage = async (
  image: File
): Promise<string> => {
  if (!image) {
    throw new Error("Please select an image.");
  }

  if (!image.type.startsWith("image/")) {
    throw new Error("Only image files are allowed.");
  }

  if (image.size > 5 * 1024 * 1024) {
    throw new Error("Image size must not exceed 5MB.");
  }

  const formData = new FormData();
  formData.append("image", image);

  const response = await apiClient.post<ImageUploadResponse>(
    "/images/upload",
    formData
  );

  if (!response.data.success || !response.data.imageUrl) {
    throw new Error(
      response.data.message || "Image upload failed."
    );
  }

  return response.data.imageUrl;
};