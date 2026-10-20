import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  IRegion,
  IRegionCreate,
  IRegionUpdate,
  QueryParams,
} from "@/types";

//& public
export const getRegions = (params?: QueryParams) => {
  return apiClient<ApiResponse<IRegion[]>>("/region", {
    params,
  });
};

export const getAllRegions = (params?: QueryParams) => {
  return apiClient<ApiResponse<IRegion[]>>("/region/all-region", {
    params,
  });
};

export const getSingleRegion = (id: string) => {
  return apiClient<ApiResponse<IRegion>>(`/region/${id}`);
};

//& admin
export const createRegion = (payload: IRegionCreate) => {
  return apiClient<ApiResponse<IRegion>>("/region", {
    method: "POST",
    body: payload,
  });
};

export const updateRegion = (payload: IRegionUpdate, id: string) => {
  return apiClient<ApiResponse<IRegion>>(`/region/${id}`, {
    method: "PUT",
    body: payload,
  });
};

export const statusUpdate = (id: string) => {
  return apiClient<ApiResponse<IRegion>>(`/region/${id}`, {
    method: "PATCH",
  });
};
