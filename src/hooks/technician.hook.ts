import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllTech,
  getTechnicianById,
  technicianProfileComplete,
} from "@/api";
import type { QueryParams } from "@/types";

export const useTechnicianProfileComplete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: technicianProfileComplete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
      queryClient.invalidateQueries({
        queryKey: ["all-tech"],
      });
      queryClient.invalidateQueries({
        queryKey: ["single-tech"],
      });
    },
  });
};

export const useGetAllTech = (params: QueryParams) => {
  return useQuery({
    queryKey: ["all-tech", params],
    queryFn: () => getAllTech(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useGetTechById = (id?: string | null) => {
  return useQuery({
    queryKey: ["single-tech", id],
    queryFn: () => getTechnicianById(id as string),
    enabled: Boolean(id),
  });
};
