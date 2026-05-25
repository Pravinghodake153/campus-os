// ============================================================
// CampusOS AI — Auth Hooks
// TanStack Query hooks for authentication
// ============================================================

import { useMutation, useQuery } from "@tanstack/react-query";
import { api, unwrapResponse } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import { disconnectSocket } from "@/lib/socket";

/** Login mutation */
export function useLogin() {
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      return login(email, password);
    },
  });
}

/** Fetch current user profile */
export function useMe() {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const res = await api.get("/auth/me");
      return unwrapResponse<Record<string, unknown>>(res);
    },
    enabled: !!token,
  });
}

/** Logout action */
export function useLogout() {
  const logout = useAuthStore((s) => s.logout);

  return () => {
    disconnectSocket();
    logout();
  };
}
