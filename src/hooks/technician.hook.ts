import { technicianProfileComplete } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useTechnicianProfileComplete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: technicianProfileComplete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
  });
};
