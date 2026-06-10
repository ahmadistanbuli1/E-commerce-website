import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "../config/api";
import { setCsrfToken } from "../lib/csrf";
import { clearAuthSession } from "../lib/queryClient";
import { toastSuccess } from "../lib/toast";

export type AuthUser = {
  id: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
  firstName: string;
  lastName: string;
};

type MeResponse = {
  user: AuthUser | null;
};

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  const { data } = await api.get<MeResponse>("/auth/me");
  if (data.user) {
    const csrf = await api.get<{ csrfToken: string | null }>("/auth/csrf");
    if (csrf.data.csrfToken) {
      setCsrfToken(csrf.data.csrfToken);
    }
  }
  return data.user;
}

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: fetchCurrentUser,
    retry: false,
    staleTime: 60_000
  });
}

export function useAuthSession() {
  const me = useMe();
  return {
    user: me.data ?? null,
    isLoggedIn: Boolean(me.data),
    isLoading: me.isLoading
  };
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout");
    },
    onSuccess: () => {
      clearAuthSession();
      qc.clear();
      toastSuccess("Logged out successfully");
    }
  });
}

/** Logout and replace history so the user cannot navigate back to protected pages. */
export function useLogoutAndRedirect() {
  const logout = useLogout();
  const navigate = useNavigate();

  return () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        navigate("/login", { replace: true });
      },
      onError: () => {
        clearAuthSession();
        navigate("/login", { replace: true });
      }
    });
  };
}
