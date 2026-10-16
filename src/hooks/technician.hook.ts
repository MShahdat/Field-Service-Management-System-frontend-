import { getAllTech, technicianProfileComplete } from "@/api";
import { QueryParams } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useTechnicianProfileComplete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: technicianProfileComplete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
      queryClient.invalidateQueries({
        queryKey: ["all-tech"]
      })
    },
  });
};




export const useGetAllTech = (params: QueryParams) => {
  return useQuery({
    queryKey: ['all-tech'],
    queryFn: () => getAllTech(params)
  })
}