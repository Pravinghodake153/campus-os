"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { getDefaultRoute } from "@/lib/role-routing";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isHydrated, user } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) return;

    if (isAuthenticated && user) {
      router.replace(getDefaultRoute(user.role));
    } else {
      router.replace("/login");
    }
  }, [isAuthenticated, isHydrated, user, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--text-muted)] border-t-[var(--accent)]" />
    </div>
  );
}
