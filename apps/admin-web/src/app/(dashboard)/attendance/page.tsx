"use client";

// ============================================================
// CampusOS AI — Attendance Page
// ============================================================

import { TopBar } from "@/components/layout/top-bar";
import { BranchAttendanceCard } from "@/components/attendance/branch-attendance-card";
import { useAttendanceSummary } from "@/hooks/use-attendance";
import { getAttendanceColor } from "@/lib/utils";

export default function AttendancePage() {
  const { data, isLoading, error } = useAttendanceSummary();

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Attendance" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[1400px] mx-auto space-y-6">
          {/* Overall stats */}
          {data && (
            <div className="soft-surface p-4 flex items-center gap-6">
              <div>
                <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide">
                  Overall Attendance
                </p>
                <p
                  className={`text-3xl font-bold mt-1 ${getAttendanceColor(
                    data.overall.averageAttendance
                  )}`}
                >
                  {data.overall.averageAttendance}%
                </p>
              </div>
              <div className="h-10 w-px bg-[var(--border-subtle)]" />
              <div>
                <p className="text-xs text-[var(--text-muted)]">Branches</p>
                <p className="text-lg font-semibold text-[var(--text-primary)]">
                  {data.overall.totalBranches}
                </p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)]">
                  Total Sessions
                </p>
                <p className="text-lg font-semibold text-[var(--text-primary)]">
                  {data.overall.totalSessions}
                </p>
              </div>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="soft-surface p-5 animate-pulse">
                  <div className="h-4 w-16 rounded bg-[var(--bg-elevated)] mb-2" />
                  <div className="h-8 w-20 rounded bg-[var(--bg-elevated)] mb-3" />
                  <div className="h-1.5 w-full rounded bg-[var(--bg-elevated)]" />
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="soft-surface p-4 text-sm text-red-400">
              Failed to load attendance data.
            </div>
          )}

          {/* Branch cards */}
          {data && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.branches.map((branch) => (
                <BranchAttendanceCard
                  key={branch.branchId}
                  branchName={branch.branchName}
                  branchCode={branch.branchCode}
                  averageAttendance={branch.averageAttendance}
                  totalStudents={branch.totalStudents}
                  totalSessions={branch.totalSessions}
                  status={branch.status}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
