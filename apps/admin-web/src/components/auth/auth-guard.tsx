"use client";

// ============================================================
// CampusOS AI — Auth Guard
// Protects routes, redirects unauthorized users
// ============================================================

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { isWebRole } from "@/lib/role-routing";

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isHydrated, user } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated || !user) {
      router.replace("/login");
      return;
    }

    // Block non-web roles (students/faculty should use mobile app)
    if (!isWebRole(user.role)) {
      router.replace("/login");
      return;
    }
  }, [isAuthenticated, isHydrated, user, router]);

  // Show loading state during hydration
  if (!isHydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--bg-primary)]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--text-muted)] border-t-[var(--accent)]" />
          <p className="text-sm text-[var(--text-muted)]">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated — show nothing while redirecting
  if (!isAuthenticated || !user) {
    return null;
  }

  return <>{children}</>;
}
