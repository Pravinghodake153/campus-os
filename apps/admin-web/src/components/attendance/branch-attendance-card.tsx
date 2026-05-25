"use client";

// ============================================================
// CampusOS AI — Branch Attendance Card
// ============================================================

import { getAttendanceColor } from "@/lib/utils";

interface BranchAttendanceCardProps {
  branchName: string;
  branchCode: string;
  averageAttendance: number;
  totalStudents: number;
  totalSessions: number;
  status: string;
}

export function BranchAttendanceCard({
  branchName,
  branchCode,
  averageAttendance,
  totalStudents,
  totalSessions,
}: BranchAttendanceCardProps) {
  return (
    <div className="soft-surface p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">
            {branchCode}
          </h3>
          <p className="text-xs text-[var(--text-muted)]">{branchName}</p>
        </div>
        <span
          className={`text-2xl font-bold ${getAttendanceColor(
            averageAttendance
          )}`}
        >
          {averageAttendance}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 rounded-full bg-[var(--bg-primary)] mb-3">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            averageAttendance >= 75
              ? "bg-green-500"
              : averageAttendance >= 60
              ? "bg-amber-500"
              : "bg-red-500"
          }`}
          style={{ width: `${Math.min(averageAttendance, 100)}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-[var(--text-muted)]">
        <span>{totalStudents} students</span>
        <span>{totalSessions} sessions</span>
      </div>
    </div>
  );
}
