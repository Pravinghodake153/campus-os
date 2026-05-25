import { useMutation, useQuery } from "@tanstack/react-query";
import { api, unwrapResponse } from "@/lib/api";

export function useRiskBatch() {
  return useMutation({
    mutationFn: async (branchId: string) => {
      const response = await api.post("/ai/risk/batch", { branchId });
      return response.data; // Note: using raw response to get fallback flag
    },
  });
}

export function useRiskModelInfo() {
  return useQuery({
    queryKey: ["ai", "risk", "model-info"],
    queryFn: async () => {
      const response = await api.get("/ai/risk/model-info");
      return unwrapResponse(response);
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useRiskRetrain() {
  return useMutation({
    mutationFn: async () => {
      const response = await api.post("/ai/risk/train");
      return unwrapResponse(response);
    },
  });
}

export function useTimetableGenerate() {
  return useMutation({
    mutationFn: async (data: { campusId: string; branchId: string; semester: number; section: string }) => {
      const response = await api.post("/ai/timetable/generate", data);
      return unwrapResponse(response);
    },
  });
}

export function useTimetableSave() {
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/ai/timetable/save", data);
      return unwrapResponse(response);
    },
  });
}

export function useAiAssistant() {
  return useMutation({
    mutationFn: async (query: string) => {
      const response = await api.post("/ai/assistant/query", { query });
      return response.data;
    },
  });
}
