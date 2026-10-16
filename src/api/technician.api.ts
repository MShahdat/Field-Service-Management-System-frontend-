import apiClient from "@/lib/apiClient";
import { ITechnicianProfileComplete, QueryParams } from "@/types";

export const technicianProfileComplete = (
  payload: ITechnicianProfileComplete,
) => {
  return apiClient("/technician/me/profile", {
    method: "PUT",
    body: payload,
  });
};




export const getAllTech = (params: QueryParams) => {
  return apiClient('/technician/all-technicians', {
    params
  })
}
