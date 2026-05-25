import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useFaculty(campusId?: string) {
  return useQuery({
    queryKey: ["faculty", campusId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (campusId) params.set("campusId", campusId);
      const res = await api.get(`/faculty?${params.toString()}`);
      return res.data;
    },
  });
}

export function useAddFaculty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post("/faculty", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faculty"] });
    },
  });
}
