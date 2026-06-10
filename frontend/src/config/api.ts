import axios, { type InternalAxiosRequestConfig } from "axios";
import { clearAuthSession } from "../lib/queryClient";
import { getCsrfToken, setCsrfToken } from "../lib/csrf";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api",
  withCredentials: true
});

const AUTH_SESSION_CHECK_PATHS = ["/auth/me"];
const AUTH_PUBLIC_PATHS = ["/auth/login", "/auth/register", "/auth/refresh"];

function isAuthSessionCheck(url: string) {
  return AUTH_SESSION_CHECK_PATHS.some((path) => url.includes(path));
}

function isAuthPublicPath(url: string) {
  return AUTH_PUBLIC_PATHS.some((path) => url.includes(path));
}

function isMutatingMethod(method: string | undefined) {
  return ["post", "put", "patch", "delete"].includes((method ?? "get").toLowerCase());
}

function captureCsrfFromResponse(data: unknown) {
  if (data && typeof data === "object" && "csrfToken" in data) {
    const token = (data as { csrfToken?: unknown }).csrfToken;
    if (typeof token === "string" && token.length > 0) {
      setCsrfToken(token);
    }
  }
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (isMutatingMethod(config.method)) {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      config.headers.set("X-CSRF-Token", csrfToken);
    }
  }
  return config;
});

let refreshPromise: Promise<void> | null = null;

async function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = api
      .post("/auth/refresh")
      .then((response) => {
        captureCsrfFromResponse(response.data);
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

api.interceptors.response.use(
  (response) => {
    captureCsrfFromResponse(response.data);
    return response;
  },
  async (error) => {
    const status = error.response?.status;
    const url: string = error.config?.url ?? "";
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (status === 403 && originalRequest && !originalRequest._retry && error.response?.data?.message === "Invalid CSRF token") {
      originalRequest._retry = true;
      try {
        const { data } = await api.get<{ csrfToken: string | null }>("/auth/csrf");
        if (data.csrfToken) {
          setCsrfToken(data.csrfToken);
          return api(originalRequest);
        }
      } catch {
        // fall through
      }
    }

    if (status === 401 && originalRequest && !originalRequest._retry && !isAuthPublicPath(url)) {
      originalRequest._retry = true;
      try {
        await refreshSession();
        return api(originalRequest);
      } catch {
        if (!isAuthSessionCheck(url)) {
          clearAuthSession();
        }
        return Promise.reject(error);
      }
    }

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
