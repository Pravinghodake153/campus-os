import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useTransportRoutes(campusId?: string) {
  return useQuery({
    queryKey: ["transport", campusId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (campusId) params.set("campusId", campusId);
      const res = await api.get(`/transport?${params.toString()}`);
      return res.data;
    },
  });
}

export function useAddTransportRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post("/transport", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transport"] });
    },
  });
}
