"use client";

// ============================================================
// CampusOS AI — Alerts Panel
// Recent AI/system alerts with severity indicators
// ============================================================

interface Alert {
  id: string;
  type: string;
  severity: string;
  message: string;
  createdAt: string;
}

interface AlertsPanelProps {
  alerts: Alert[];
}

function getSeverityColor(severity: string): string {
  switch (severity) {
    case "critical":
      return "bg-red-500";
    case "warning":
      return "bg-amber-500";
    case "info":
      return "bg-blue-500";
    default:
      return "bg-[var(--text-muted)]";
  }
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-[var(--text-muted)]">
        No recent alerts
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="flex items-start gap-3 rounded-lg bg-[var(--bg-primary)] px-3 py-2.5 border border-[var(--border-subtle)]"
        >
          <div
            className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${getSeverityColor(
              alert.severity
            )}`}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {alert.message}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
