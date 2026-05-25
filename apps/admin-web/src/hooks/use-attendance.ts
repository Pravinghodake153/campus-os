// ============================================================
// CampusOS AI — Attendance Hook
// ============================================================

import { useQuery } from "@tanstack/react-query";
import { api, unwrapResponse } from "@/lib/api";

interface BranchAttendance {
  branchId: string;
  branchName: string;
  branchCode: string;
  totalStudents: number;
  totalSessions: number;
  averageAttendance: number;
  status: string;
}

interface AdminAttendanceSummary {
  type: "admin";
  overall: {
    totalBranches: number;
    totalSessions: number;
    averageAttendance: number;
  };
  branches: BranchAttendance[];
}

export function useAttendanceSummary() {
  return useQuery({
    queryKey: ["attendance", "summary"],
    queryFn: async () => {
      const res = await api.get("/attendance/summary");
      return unwrapResponse<AdminAttendanceSummary>(res);
    },
  });
}
