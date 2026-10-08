import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MyOrder, singleOrder, todaysOrder, updateOrderStatus } from "@/api";
import type { IUpdateOrderStatus, QueryParams } from "@/types";

export const useMyOrder = (params: QueryParams) => {
  return useQuery({
    queryKey: ["my-order", params],
    queryFn: () => MyOrder(params),
  });
};

export const useSingleOrder = (id: string) => {
  return useQuery({
    queryKey: ["single-order", id],
    queryFn: () => singleOrder(id),
  });
};

export const useTodaysOrder = (params: QueryParams) => {
  return useQuery({
    queryKey: ["todays-order", params],
    queryFn: todaysOrder,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-order"],
      });
      queryClient.invalidateQueries({
        queryKey: ["single-order"],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-service-customer"],
      });
      queryClient.invalidateQueries({
        queryKey: ["single-service"],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-region-service"],
      });
      queryClient.invalidateQueries({
        queryKey: ["todays-order"],
      });
    },
  });
};
