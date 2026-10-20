import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  ITechnicianDetail,
  ITechnicianProfileComplete,
  ITechnicianPublic,
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
  apiClient<ApiResponse<ITechnicianPublic[]>>("/technician/all-technicians", {
    params,
  });

export const getTechnicianById = (id: string) =>
  apiClient<ApiResponse<ITechnicianDetail>>(`/technician/${id}`);
