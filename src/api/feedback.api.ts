import apiClient from "@/lib/apiClient";
import { QueryParams } from "@/types";
import {
  IFeedbackPayload,
  IFeedbackUpdatePayload,
} from "@/types/feedback.type";

export const createFeedback = (payload: IFeedbackPayload) => {
  return apiClient(`/feedback`, {
    method: "POST",
    body: payload,
  });
};

export const udpateFeedback = (payload: IFeedbackUpdatePayload, id: string) => {
  return apiClient(`/feedback/update/${id}`, {
    method: "PATCH",
    body: payload,
  });
};

export const getSingleFeedback = (id: string) => {
  return apiClient(`/feedback/${id}`);
};

export const getAllFeedback = (params: QueryParams) => {
  return apiClient("/feedback/all-feedback", {
    params,
  });
};

export const deleteFeedback = (id: string) => {
  return apiClient(`/feedback/delete/${id}`, {
    method: "DELETE",
  });
};
