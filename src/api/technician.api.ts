import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  ITechnician,
  ITechnicianProfileComplete,
  QueryParams,
} from "@/types";

export const technicianProfileComplete = (
  payload: ITechnicianProfileComplete,
) =>
  apiClient("/technician/me/profile", {
    method: "PUT",
    body: payload,
  });

export const getAllTech = (params: QueryParams) =>
  apiClient<ApiResponse<ITechnician[]>>("/technician/all-technicians", {
    params,
  });

export const getTechnicianById = (id: string) =>
  apiClient<ApiResponse<ITechnician>>(`/technician/${id}`);
