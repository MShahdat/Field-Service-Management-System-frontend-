import apiClient from "@/lib/apiClient";
import type { QueryParams } from "@/types";

export const updateProfileImg = (payload: File) => {
  const formData = new FormData();
  formData.append("profile", payload);

  return apiClient("/user/profile-image", {
    method: "PATCH",
    body: formData,
  });
};

export const getAllUsers = (params: QueryParams) => {
  return apiClient("/user/all-users", {
    params,
  });
};

export type StatusUpdatePayload = "ACTIVE" | "BLOCKED" | "DELETED";

export const updateStatus = (payload: StatusUpdatePayload, id: string) => {
  return apiClient(`/user/status-update/${id}`, {
    method: "PATCH",
    body: { status: payload },
  });
};
