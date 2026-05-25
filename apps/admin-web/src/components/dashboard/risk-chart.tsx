"use client";

// ============================================================
// CampusOS AI — Risk Distribution Chart
// Donut chart showing Low/Medium/High risk distribution
// ============================================================

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface RiskChartProps {
  high: number;
  medium: number;
  low: number;
}

const COLORS = {
  High: "#ef4444",
  Medium: "#f59e0b",
  Low: "#22c55e",
};

export function RiskChart({ high, medium, low }: RiskChartProps) {
  const data = [
    { name: "High", value: high },
    { name: "Medium", value: medium },
    { name: "Low", value: low },
  ].filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-[var(--text-muted)]">
        No risk data available
      </div>
    );
  }

  return (
    <div className="flex items-center gap-6">
      <ResponsiveContainer width={160} height={160}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={72}
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={COLORS[entry.name as keyof typeof COLORS]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-default)",
              borderRadius: "8px",
              fontSize: "12px",
              color: "var(--text-primary)",
            }}
            formatter={(value: number) => [value, "Students"]}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="space-y-3">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{
                background: COLORS[entry.name as keyof typeof COLORS],
              }}
            />
            <span className="text-xs text-[var(--text-secondary)]">
              {entry.name}
            </span>
            <span className="text-xs font-medium text-[var(--text-primary)]">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
