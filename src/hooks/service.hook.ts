import { createService, customerMyServices, updateService } from "@/api";
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
    },
  });
};
