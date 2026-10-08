import { createPayment } from "@/api";
import { useMutation } from "@tanstack/react-query";

export const usePaymentCreate = () => {
  return useMutation({
    mutationFn: createPayment,
  });
};
