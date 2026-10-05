import apiClient from "@/lib/apiClient";
import { IServiceCreate, IServiceUpdate, QueryParams } from "@/types";

export const customerMyServices = (params: QueryParams) => {
  return apiClient("/service/my-services", {
    params,
  });
};

export const createService = (payload: IServiceCreate) => {
  return apiClient("/service", {
    method: "POST",
    body: payload,
  });
};

export const updateService = (payload: IServiceUpdate, id: string) => {
  return apiClient(`/service/${id}`, {
    method: "PUT",
    body: payload,
  });
};
