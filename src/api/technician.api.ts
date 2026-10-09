import apiClient from "@/lib/apiClient";
import { ITechnicianProfileComplete } from "@/types";

export const technicianProfileComplete = (
  payload: ITechnicianProfileComplete,
) => {
  return apiClient("/technician/me/profile", {
    method: "PUT",
    body: payload,
  });
};
