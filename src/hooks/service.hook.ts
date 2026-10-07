import {
  assignTechnician,
  createService,
  customerMyServices,
  deleteService,
  getEligibleTechnician,
  getMyRegionService,
  reviewService,
  singleService,
  updateService,
} from "@/api";
import { QueryParams } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCustomerMyService = (params: QueryParams) => {
  return useQuery({
    queryKey: ["my-service-customer", params],
    queryFn: () => customerMyServices(params),
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-service-customer"],
      });
      queryClient.invalidateQueries({
        queryKey: ["single-service"],
      });
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      payload,
      id,
    }: {
      payload: Parameters<typeof updateService>[0];
      id: Parameters<typeof updateService>[1];
    }) => updateService(payload, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-service-customer"],
      });
      queryClient.invalidateQueries({
        queryKey: ["single-service"],
      });
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-service-customer"],
      });
      queryClient.invalidateQueries({
        queryKey: ["single-service"],
      });
    },
  });
};

export const useSingleService = (id: string) => {
  return useQuery({
    queryKey: ["single-service", id],
    queryFn: () => singleService(id),
  });
};

export const useGetMyRegionService = (params?: QueryParams) => {
  return useQuery({
    queryKey: ["my-region-service", params],
    queryFn: () => getMyRegionService(params),
  });
};

export const useReviewService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reviewService,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-service-customer"],
      });
      queryClient.invalidateQueries({
        queryKey: ["single-service"],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-region-service"],
      });
    },
  });
};

export const useEligibleTechnician = (id: string) => {
  return useQuery({
    queryKey: ["eligible-technician", id],
    queryFn: () => getEligibleTechnician(id),
  });
};

export const useAssignTechnician = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignTechnician,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-service-customer"],
      });
      queryClient.invalidateQueries({
        queryKey: ["single-service"],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-region-service"],
      });
    },
  });
};
