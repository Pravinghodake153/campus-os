"use client";

// ============================================================
// CampusOS AI — Attendance Bar Chart
// Branch-wise attendance visualization
// ============================================================

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface AttendanceData {
  branchCode: string;
  branchName: string;
  averageAttendance: number;
  totalStudents: number;
}

interface AttendanceChartProps {
  data: AttendanceData[];
}

function getBarColor(value: number): string {
  if (value >= 75) return "#22c55e";
  if (value >= 60) return "#f59e0b";
  return "#ef4444";
}

export function AttendanceChart({ data }: AttendanceChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-[var(--text-muted)]">
        No attendance data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border-subtle)"
          horizontal={false}
        />
        <XAxis
          type="number"
          domain={[0, 100]}
          tick={{ fill: "var(--text-muted)", fontSize: 11 }}
          axisLine={{ stroke: "var(--border-subtle)" }}
          tickLine={false}
          unit="%"
        />
        <YAxis
          type="category"
          dataKey="branchCode"
          width={50}
          tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-default)",
            borderRadius: "8px",
            fontSize: "12px",
            color: "var(--text-primary)",
          }}
          formatter={(value: number) => [`${value}%`, "Attendance"]}
          labelStyle={{ color: "var(--text-secondary)" }}
        />
        <Bar dataKey="averageAttendance" radius={[0, 4, 4, 0]} maxBarSize={24}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={getBarColor(entry.averageAttendance)}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
