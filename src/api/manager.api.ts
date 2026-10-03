import apiClient from "@/lib/apiClient";
import { IManagerApplyPayload } from "@/types";

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
