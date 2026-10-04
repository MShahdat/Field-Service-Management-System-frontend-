import apiClient from "@/lib/apiClient";
import { IManagerApplyPayload, IReviewManager, QueryParams } from "@/types";

export const managerApply = (payload: IManagerApplyPayload) => {
  return apiClient("/manager/manager-apply", {
    method: "POST",
    body: payload,
  });
};

export const managerEmailVerify = (payload: { email: string; otp: string }) => {
  return apiClient("/manager/email-verify", {
    method: "POST",
    body: payload,
  });
};

export const getManagerList = (params?: QueryParams) => {
  return apiClient(`/manager/all-managers`, {
    params,
  });
};

export const managerReview = (payload: IReviewManager) => {
  return apiClient("/manager/manager-approved", {
    method: "POST",
    body: payload,
  });
};
