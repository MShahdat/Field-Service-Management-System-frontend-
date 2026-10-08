import apiClient from "@/lib/apiClient";
import { IUpdateOrderStatus, QueryParams } from "@/types";

export const MyOrder = (params: QueryParams) => {
  return apiClient("/workorder/my-workorder", {
    params,
  });
};

export const singleOrder = (id: string) => {
  return apiClient(`/workorder/${id}`);
};

export const updateOrderStatus = (payload: IUpdateOrderStatus) => {
  return apiClient("/workorder/update", {
    method: "PATCH",
    body: payload,
  });
};

export const todaysOrder = (params: QueryParams) => {
  return apiClient(`/workorder/today`, {
    params,
  });
};
