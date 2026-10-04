import {
  createRegion,
  getAllRegions,
  getRegions,
  statusUpdate,
  updateRegion,
} from "@/api";
import { QueryParams } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

//& public
export const useGetRegions = (params?: QueryParams) => {
  return useQuery({
    queryKey: ["regions", params],
    queryFn: () => getRegions(params),
  });
};

//& admin
export const useGetAllRegions = (params?: QueryParams) => {
  return useQuery({
    queryKey: ["all-regions", params],
    queryFn: () => getAllRegions(params),
  });
};

export const useRegionCreate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRegion,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["all-regions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["regions"],
      });
    },
  });
};

export const useUpdateRegion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      payload,
      id,
    }: {
      payload: Parameters<typeof updateRegion>[0];
      id: Parameters<typeof updateRegion>[1];
    }) => updateRegion(payload, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["all-regions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["regions"],
      });
    },
  });
};

export const useStatusUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => statusUpdate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["all-regions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["regions"],
      });
    },
  });
};
