import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useHostels(campusId?: string) {
  return useQuery({
    queryKey: ["hostels", campusId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (campusId) params.set("campusId", campusId);
      const res = await api.get(`/hostel?${params.toString()}`);
      return res.data;
    },
  });
}

export function useAddHostel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post("/hostel", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hostels"] });
    },
  });
}
