"use client";

// ============================================================
// CampusOS AI — Settings Page
// Theme switching, profile preferences, system info
// ============================================================

import { useSettings } from "@/hooks/use-settings";
import {
  Sun,
  Moon,
  Monitor,
  Palette,
  User,
  Bell,
  Shield,
  Info,
  ChevronRight,
  Check,
} from "lucide-react";

export default function SettingsPage() {
  const { theme, changeTheme, mounted, resolvedTheme } = useSettings();

  if (!mounted) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const themeOptions = [
    {
      id: "light" as const,
      label: "Light",
      desc: "Clean white interface",
      icon: Sun,
    },
    {
      id: "dark" as const,
      label: "Dark",
      desc: "Easy on the eyes at night",
      icon: Moon,
    },
    {
      id: "system" as const,
      label: "System",
      desc: "Follows your device setting",
      icon: Monitor,
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Settings</h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Manage your preferences and account settings.
        </p>
      </div>

      {/* Appearance Section */}
      <section className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <Palette className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="font-semibold text-[var(--text-primary)]">Appearance</h2>
            <p className="text-xs text-[var(--text-secondary)]">Customize how CampusOS AI looks</p>
          </div>
        </div>

        <div className="p-6">
          <p className="text-sm font-medium text-[var(--text-secondary)] mb-4">Theme</p>
          <div className="grid grid-cols-3 gap-3">
            {themeOptions.map(({ id, label, desc, icon: Icon }) => (
              <button
                key={id}
                onClick={() => changeTheme(id)}
                className={`relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer group
                  ${
                    theme === id
                      ? "border-[var(--accent)] bg-[var(--accent)]/10 shadow-lg shadow-[var(--accent)]/10"
                      : "border-[var(--border-subtle)] bg-[var(--bg-primary)] hover:border-[var(--accent)]/50 hover:bg-[var(--bg-surface)]"
                  }`}
              >
                {theme === id && (
                  <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[var(--accent)] flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </span>
                )}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                    theme === id
                      ? "bg-[var(--accent)] text-white"
                      : "bg-[var(--bg-surface)] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p
                    className={`text-sm font-semibold ${
                      theme === id ? "text-[var(--accent)]" : "text-[var(--text-primary)]"
                    }`}
                  >
                    {label}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">{desc}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-[var(--text-secondary)]">
              Currently resolved to:{" "}
              <span className="text-[var(--text-primary)] font-medium capitalize">
                {resolvedTheme ?? "dark"}
              </span>{" "}
              mode
            </span>
          </div>
        </div>
      </section>

      {/* Profile Section */}
      <section className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <User className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="font-semibold text-[var(--text-primary)]">Profile</h2>
            <p className="text-xs text-[var(--text-secondary)]">Your account information</p>
          </div>
        </div>
        <div className="divide-y divide-[var(--border-subtle)]">
          {[
            { label: "Name", value: "Super Admin" },
            { label: "Email", value: "admin@campusos.ai" },
            { label: "Role", value: "SUPER_ADMIN" },
            { label: "Campus", value: "All Campuses" },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-6 py-4">
              <span className="text-sm text-[var(--text-secondary)]">{label}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[var(--text-primary)]">{value}</span>
                <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Notifications Section */}
      <section className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="font-semibold text-[var(--text-primary)]">Notifications</h2>
            <p className="text-xs text-[var(--text-secondary)]">Control what alerts you receive</p>
          </div>
        </div>
        <div className="divide-y divide-[var(--border-subtle)]">
          {[
            { label: "High Risk Student Alerts", enabled: true },
            { label: "Attendance Drop Alerts", enabled: true },
            { label: "Placement Drive Reminders", enabled: false },
            { label: "Hostel Complaint Updates", enabled: true },
          ].map(({ label, enabled }) => (
            <div key={label} className="flex items-center justify-between px-6 py-4">
              <span className="text-sm text-[var(--text-primary)]">{label}</span>
              <div
                className={`w-11 h-6 rounded-full relative transition-colors duration-200 cursor-pointer ${
                  enabled ? "bg-[var(--accent)]" : "bg-[var(--border-subtle)]"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                    enabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* System Info */}
      <section className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center">
            <Info className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h2 className="font-semibold text-[var(--text-primary)]">System</h2>
            <p className="text-xs text-[var(--text-secondary)]">CampusOS AI Platform info</p>
          </div>
        </div>
        <div className="divide-y divide-[var(--border-subtle)]">
          {[
            { label: "Platform Version", value: "v1.0.0-mvp" },
            { label: "AI Engine", value: "Gemini 3.0 Pro / 2.5 Flash" },
            { label: "Backend", value: "Node.js + Prisma + PostgreSQL" },
            { label: "Deployment", value: "Hugging Face Spaces + Vercel" },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-6 py-4">
              <span className="text-sm text-[var(--text-secondary)]">{label}</span>
              <span className="text-sm font-medium text-[var(--text-primary)]">{value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Security */}
      <section className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h2 className="font-semibold text-[var(--text-primary)]">Security</h2>
            <p className="text-xs text-[var(--text-secondary)]">Authentication and access control</p>
          </div>
        </div>
        <div className="p-6 flex flex-col sm:flex-row gap-3">
          <button className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30 text-sm font-medium hover:bg-[var(--accent)]/20 transition-colors">
            Change Password
          </button>
          <button className="flex-1 px-4 py-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 text-sm font-medium hover:bg-red-500/20 transition-colors">
            Sign Out of All Devices
          </button>
        </div>
      </section>
    </div>
  );
}
