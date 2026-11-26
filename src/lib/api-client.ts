import axios from "axios";
import { authClient } from "@/lib/auth-client";

const apiClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",

  headers: {
    "Content-Type": "application/json",
  },

  withCredentials: true,
});

// Attach Better Auth JWT to API requests
apiClient.interceptors.request.use(async (config) => {
  try {
    // Important: Allow browser to set multipart boundary for FormData
    if (
      typeof FormData !== "undefined" &&
      config.data instanceof FormData
    ) {
      config.headers.delete("Content-Type");
    }

    const { data, error } = await authClient.token();

    if (!error && data?.token) {
      config.headers.Authorization = `Bearer ${data.token}`;
    }
  } catch (error) {
    console.error(
      "Failed to retrieve authentication token:",
      error
    );
  }

  return config;
});

// Handle API errors
apiClient.interceptors.response.use(
  (response) => response,

  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    return Promise.reject(new Error(message));
  }
);

export default apiClient;