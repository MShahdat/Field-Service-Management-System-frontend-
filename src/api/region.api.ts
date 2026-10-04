import apiClient from "@/lib/apiClient";
import { IRegionCreate, IRegionUpdate, QueryParams } from "@/types";

//& public
export const getRegions = (params?: QueryParams) => {
  return apiClient("/region", {
    params,
  });
};

export const getAllRegions = (params?: QueryParams) => {
  return apiClient("/region/all-region", {
    params,
  });
};

export const createRegion = (payload: IRegionCreate) => {
  return apiClient("/region", {
    method: "POST",
    body: payload,
  });
};

export const updateRegion = (payload: IRegionUpdate, id: string) => {
  return apiClient(`/region/${id}`, {
    method: "PUT",
    body: payload,
  });
};

export const statusUpdate = (id: string) => {
  return apiClient(`/region/${id}`, {
    method: "PATCH",
  });
};
