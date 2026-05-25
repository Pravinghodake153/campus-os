"use client";

// ============================================================
// CampusOS AI — Login Page
// Clean, minimal login with role-based redirect
// ============================================================

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/use-auth";
import { getDefaultRoute } from "@/lib/role-routing";
import { useAuthStore } from "@/stores/auth-store";
import { useFilterStore } from "@/stores/filter-store";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();
  const loginMutation = useLogin();
  const { isAuthenticated, user } = useAuthStore();
  const initializeFilters = useFilterStore((s) => s.initializeFromUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace(getDefaultRoute(user.role));
    }
  }, [isAuthenticated, user, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const loggedInUser = await loginMutation.mutateAsync({ email, password });
      initializeFilters(
        loggedInUser.role,
        loggedInUser.campusId,
        loggedInUser.branchId
      );
      router.push(getDefaultRoute(loggedInUser.role));
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(
        axiosErr?.response?.data?.message || "Login failed. Please try again."
      );
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left — Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 bg-[var(--bg-surface)]">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)] text-white font-bold text-lg">
              C
            </div>
            <span className="text-xl font-semibold text-[var(--text-primary)]">
              CampusOS AI
            </span>
          </div>

          <h1 className="text-3xl font-semibold text-[var(--text-primary)] leading-tight mb-4">
            Unified Smart Campus
            <br />
            Operating System
          </h1>

          <p className="text-[var(--text-secondary)] leading-relaxed mb-8">
            A centralized platform connecting academics, attendance, placements,
            hostel, transport, and AI-powered analytics into one scalable
            system.
          </p>

          <div className="space-y-3">
            {[
              "AI-Powered Academic Risk Prediction",
              "Smart BLE + Location Attendance",
              "Dynamic Timetable Optimization",
              "Multi-Campus Interoperability",
            ].map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="flex flex-1 items-center justify-center px-8 bg-[var(--bg-primary)]">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)] text-white font-bold text-lg">
              C
            </div>
            <span className="text-xl font-semibold text-[var(--text-primary)]">
              CampusOS AI
            </span>
          </div>

          <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-1">
            Welcome back
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-8">
            Sign in to your admin account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="super@campusos.ai"
                required
                className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-4 py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginMutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-3">
            <p className="text-xs text-[var(--text-muted)] mb-2">
              Demo credentials
            </p>
            <div className="space-y-1 text-xs text-[var(--text-secondary)]">
              <p>
                <span className="text-[var(--text-muted)]">Admin:</span>{" "}
                super@campusos.ai
              </p>
              <p>
                <span className="text-[var(--text-muted)]">HOD:</span>{" "}
                hod.cse@campusos.ai
              </p>
              <p>
                <span className="text-[var(--text-muted)]">Password:</span>{" "}
                campusos123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
