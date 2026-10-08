import apiClient from "@/lib/apiClient";
import { IPaymentPayload } from "@/types";

export const createPayment = (payload: IPaymentPayload) => {
  return apiClient("/payment/create", {
    method: "POST",
    body: payload,
  });
};
