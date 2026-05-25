"use client";

// ============================================================
// CampusOS AI — Students Table
// ============================================================

import { cn, getRiskColor, getRiskBg } from "@/lib/utils";

interface Student {
  id: string;
  rollNumber: string;
  name: string;
  email: string;
  branchCode: string;
  semester: number;
  section: string;
  cgpa: number;
  placementStatus: string;
  latestRisk: { riskScore: number; riskLevel: string } | null;
}

interface StudentsTableProps {
  students: Student[];
  isLoading: boolean;
}

export function StudentsTable({ students, isLoading }: StudentsTableProps) {
  if (isLoading) {
    return (
      <div className="soft-surface overflow-hidden">
        <div className="p-4 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="h-4 w-20 rounded bg-[var(--bg-elevated)]" />
              <div className="h-4 w-32 rounded bg-[var(--bg-elevated)]" />
              <div className="h-4 w-12 rounded bg-[var(--bg-elevated)]" />
              <div className="h-4 w-8 rounded bg-[var(--bg-elevated)]" />
              <div className="h-4 w-8 rounded bg-[var(--bg-elevated)]" />
              <div className="h-4 w-12 rounded bg-[var(--bg-elevated)]" />
              <div className="h-4 w-16 rounded bg-[var(--bg-elevated)]" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!students || students.length === 0) {
    return (
      <div className="soft-surface flex items-center justify-center py-16">
        <div className="text-center">
          <p className="text-sm text-[var(--text-muted)]">No students found</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Try adjusting your filters
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="soft-surface overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border-subtle)]">
              {[
                "Roll No",
                "Name",
                "Branch",
                "Sem",
                "Sec",
                "CGPA",
                "Risk",
                "Placement",
              ].map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr
                key={student.id}
                className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--bg-surface-hover)] transition-colors"
              >
                <td className="px-4 py-3 text-[var(--text-secondary)] font-mono text-xs">
                  {student.rollNumber}
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="text-[var(--text-primary)] font-medium">
                      {student.name}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {student.email}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3 text-[var(--text-secondary)]">
                  {student.branchCode}
                </td>
                <td className="px-4 py-3 text-[var(--text-secondary)]">
                  {student.semester}
                </td>
                <td className="px-4 py-3 text-[var(--text-secondary)]">
                  {student.section}
                </td>
                <td className="px-4 py-3 text-[var(--text-primary)] font-medium">
                  {student.cgpa.toFixed(1)}
                </td>
                <td className="px-4 py-3">
                  {student.latestRisk ? (
                    <span
                      className={cn(
                        "inline-block rounded px-2 py-0.5 text-xs font-medium",
                        getRiskColor(student.latestRisk.riskLevel),
                        getRiskBg(student.latestRisk.riskLevel)
                      )}
                    >
                      {student.latestRisk.riskLevel}
                    </span>
                  ) : (
                    <span className="text-xs text-[var(--text-muted)]">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">
                  {student.placementStatus.replace(/_/g, " ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
