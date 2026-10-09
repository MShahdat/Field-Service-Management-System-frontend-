import apiClient from "@/lib/apiClient";
import {
  IAttachmentPayload,
  IUpdateAttachmentPayload,
  QueryParams,
} from "@/types";

export const createAttatchment = (payload: IAttachmentPayload) => {
  const formData = new FormData();

  formData.append("data", JSON.stringify(payload.data));

  for (const file of payload.attatchment) {
    // Backend multer fields([{ name: "attachment", maxCount: 10 }])
    formData.append("attachment", file);
  }
  return apiClient("/attachment", {
    method: "POST",
    body: formData,
  });
};

export const updateAttatchment = (
  payload: IUpdateAttachmentPayload,
  id: string,
) => {
  return apiClient(`/attachment/update/${id}`, {
    method: "PATCH",
    body: payload,
  });
};

export const getAttatchment = (params: QueryParams) => {
  return apiClient("/attachment", {
    params,
  });
};

export const deleteAttatchemet = (id: string) => {
  return apiClient(`/attachment/delete/${id}`, {
    method: "DELETE",
  });
};
