import apiClient from "@/lib/apiClient";
import { IPaymentPayload, QueryParams } from "@/types";

export const createPayment = (payload: IPaymentPayload) => {
  return apiClient("/payment/create", {
    method: "POST",
    body: payload,
  });
};

export const getPaymentInof = (params: QueryParams) => {
  return apiClient("/payment/payment-info", {
    params,
  });
};
