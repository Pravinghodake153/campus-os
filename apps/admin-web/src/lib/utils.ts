// ============================================================
// CampusOS AI — Utility Functions
// ============================================================

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with clsx */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Get text color class for risk level */
export function getRiskColor(level: string): string {
  switch (level) {
    case "HIGH":
      return "text-red-500";
    case "MEDIUM":
      return "text-amber-500";
    case "LOW":
      return "text-green-500";
    default:
      return "text-[var(--text-muted)]";
  }
}

/** Get background tint class for risk level */
export function getRiskBg(level: string): string {
  switch (level) {
    case "HIGH":
      return "bg-red-500/10";
    case "MEDIUM":
      return "bg-amber-500/10";
    case "LOW":
      return "bg-green-500/10";
    default:
      return "bg-white/5";
  }
}

/** Get text color class for attendance percentage */
export function getAttendanceColor(percentage: number): string {
  if (percentage >= 75) return "text-green-500";
  if (percentage >= 60) return "text-amber-500";
  return "text-red-500";
}

/** Get status color class */
export function getStatusColor(
  status: "success" | "warning" | "danger" | "info"
): string {
  switch (status) {
    case "success":
      return "text-green-500";
    case "warning":
      return "text-amber-500";
    case "danger":
      return "text-red-500";
    case "info":
    default:
      return "text-[var(--text-secondary)]";
  }
}

/** Format number with commas */
export function formatNumber(num: number): string {
  return num.toLocaleString("en-IN");
}

/** Format percentage */
export function formatPercentage(num: number): string {
  return `${Math.round(num)}%`;
}
