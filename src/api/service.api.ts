import apiClient from "@/lib/apiClient";
import {
  IAssignTechnician,
  IReviewService,
  IServiceCreate,
  IServiceUpdate,
  QueryParams,
} from "@/types";

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

export const deleteService = (id: string) => {
  return apiClient(`/service/delete/${id}`, {
    method: "PATCH",
  });
};

export const singleService = (id: string) => {
  return apiClient(`/service/${id}`);
};

export const reviewService = (payload: IReviewService) => {
  return apiClient("/service/review", {
    method: "POST",
    body: payload,
  });
};

export const getMyRegionService = (params?: QueryParams) => {
  return apiClient(`/service/my-region`, {
    params,
  });
};

export const getEligibleTechnician = (id: string) => {
  return apiClient(`/service/workOrder/${id}`);
};

export const assignTechnician = (payload: IAssignTechnician) => {
  return apiClient("/service/assign-technician", {
    method: "POST",
    body: payload,
  });
};
