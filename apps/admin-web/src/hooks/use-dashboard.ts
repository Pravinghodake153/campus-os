// ============================================================
// CampusOS AI — Dashboard Hook
// ============================================================

import { useQuery } from "@tanstack/react-query";
import { api, unwrapResponse } from "@/lib/api";

interface DashboardMetrics {
  totalStudents: number;
  totalFaculty: number;
  averageAttendance: number;
  highRiskStudents: number;
  placementReady: number;
  hostelOccupancy: number;
  activeTransportRoutes: number;
  activeEvents: number;
  branchWiseAttendance: {
    branchId: string;
    campusId: string;
    branchName: string;
    branchCode: string;
    averageAttendance: number;
    totalStudents: number;
  }[];
  recentAlerts: {
    id: string;
    type: string;
    severity: string;
    message: string;
    createdAt: string;
  }[];
}

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await api.get("/admin/dashboard");
      return unwrapResponse<DashboardMetrics>(res);
    },
  });
}
