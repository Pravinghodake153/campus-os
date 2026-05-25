"use client";

// ============================================================
// CampusOS AI — Metric Card
// Reusable dashboard metric card with subtle count animation
// ============================================================

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  suffix?: string;
  valueColor?: string;
}

export function MetricCard({
  label,
  value,
  icon: Icon,
  suffix = "",
  valueColor,
}: MetricCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (value === 0) {
      setDisplayValue(0);
      return;
    }

    const duration = 500;
    const steps = 20;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), value);
      setDisplayValue(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="soft-surface p-4 hover:border-[var(--border-default)]">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
          {label}
        </span>
        <Icon size={16} className="text-[var(--text-muted)]" />
      </div>
      <div className="flex items-baseline gap-1">
        <span
          className={cn(
            "text-2xl font-bold text-[var(--text-primary)]",
            valueColor
          )}
        >
          {displayValue.toLocaleString("en-IN")}
        </span>
        {suffix && (
          <span className="text-sm text-[var(--text-muted)]">{suffix}</span>
        )}
      </div>
    </div>
  );
}
