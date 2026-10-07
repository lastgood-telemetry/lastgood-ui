import axios from "axios";
import { API_BASE_URL } from "../constants/index.js";
import { toast } from "../components/ui/Toast";
const api = axios.create({
  baseURL: (API_BASE_URL || "").replace(/\/$/, "") + (import.meta.env.VITE_API_PREFIX || "/api"),
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token && !config.publicRequest) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest?.publicRequest) {
      originalRequest._retryCount = originalRequest._retryCount || 0;

      if (originalRequest._retryCount < 3) {
        originalRequest._retryCount += 1;
        return api(originalRequest);
      } else {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
        toast.error("Session expired, please login again");
      }
    } else if (error.response?.status === 404 || originalRequest?.skipToast) {
      // 404 responses (e.g. missing optional API keys or GitHub integrations) are handled gracefully by UI components.
      // Do not display intrusive global error toasts.
    } else {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "An unexpected error occurred";
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

export default api;
