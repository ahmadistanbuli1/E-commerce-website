import axios from "axios";
import { clearAuthSession } from "../lib/queryClient";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api",
  withCredentials: true
});

const AUTH_SESSION_CHECK_PATHS = ["/auth/me"];

function isAuthSessionCheck(url: string) {
  return AUTH_SESSION_CHECK_PATHS.some((path) => url.includes(path));
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url: string = error.config?.url ?? "";

    if (status === 401) {
      const isPublicAuth =
        url.includes("/auth/login") ||
        url.includes("/auth/register") ||
        isAuthSessionCheck(url);

      if (!isPublicAuth) {
        clearAuthSession();
      }
    }

    return Promise.reject(error);
  }
);
