import { createPayment, getPaymentInof } from "@/api";
import { QueryParams } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePaymentCreate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["payment-info"],
      });
    },
  });
};

export const useGetPaymentInfo = (params: QueryParams) => {
  return useQuery({
    queryKey: ["payment-info", params],
    queryFn: () => getPaymentInof(params),
  });
};
