// ============================================================
// CampusOS AI — Auth Store (Zustand)
// Persisted auth state with SSR hydration guard
// ============================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "@/lib/api";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  campusId: string | null;
  branchId: string | null;
  campusName?: string | null;
  branchName?: string | null;
  isActive: boolean;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;

  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isHydrated: false,

      login: async (email: string, password: string) => {
        const response = await api.post("/auth/login", { email, password });
        const { token, user } = response.data.data;

        set({
          user,
          token,
          isAuthenticated: true,
        });

        return user;
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      setHydrated: () => {
        set({ isHydrated: true });
      },
    }),
    {
      name: "campusos-auth",
      // Only persist user, token, isAuthenticated — not isHydrated
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
