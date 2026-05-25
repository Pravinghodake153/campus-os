// ============================================================
// CampusOS AI — Students Hook
// ============================================================

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface StudentData {
  id: string;
  rollNumber: string;
  name: string;
  email: string;
  branchCode: string;
  branchName: string;
  semester: number;
  section: string;
  cgpa: number;
  backlogs: number;
  placementStatus: string;
  latestRisk: { riskScore: number; riskLevel: string } | null;
}

interface StudentsResponse {
  success: boolean;
  data: StudentData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface StudentFilters {
  branchId?: string;
  semester?: number;
  section?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export function useStudents(filters: StudentFilters = {}) {
  return useQuery({
    queryKey: ["students", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.branchId) params.set("branchId", filters.branchId);
      if (filters.semester) params.set("semester", String(filters.semester));
      if (filters.section) params.set("section", filters.section);
      if (filters.search) params.set("search", filters.search);
      if (filters.page) params.set("page", String(filters.page));
      if (filters.limit) params.set("limit", String(filters.limit));

      const res = await api.get<StudentsResponse>(
        `/students?${params.toString()}`
      );
      return res.data;
    },
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAddStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post("/students", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}
