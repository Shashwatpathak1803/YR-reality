import axios from "axios";

/**
 * Axios instance wired to the Express backend.
 * Override the target with VITE_API_URL (e.g. https://api.example.com/api).
 */
const baseURL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:5000/api";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("YRrealty_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 && typeof window !== "undefined") {
      window.localStorage.removeItem("YRrealty_token");
      window.localStorage.removeItem("YRrealty_user");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    // Normalize backend ApiError shape ({ message }) into Error.message
    const message =
      error?.response?.data?.message ??
      error?.response?.data?.errors?.[0]?.msg ??
      error?.message ??
      "Request failed";
    return Promise.reject(new Error(message));
  },
);

/** Unwraps the backend's ApiResponse envelope: { success, statusCode, message, data, meta } */
export async function unwrap<T>(promise: Promise<{ data: { data: T } }>): Promise<T> {
  const res = await promise;
  return res.data.data;
}
