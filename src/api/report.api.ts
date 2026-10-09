import apiClient from "@/lib/apiClient";
import { QueryParams } from "@/types";
import { IReportPayload, IUpdateReportPayload } from "@/types/report.types";

export const createReport = (payload: IReportPayload) => {
  const formData = new FormData();
  formData.append(
    "data",
    JSON.stringify({
      workOrderId: payload.workOrderId,
      ...(payload.description ? { description: payload.description } : {}),
    }),
  );
  formData.append("report", payload.file);

  return apiClient("/service-report", {
    method: "POST",
    body: formData,
  });
};

export const getMyReports = (params: QueryParams) => {
  return apiClient("/service-report/my-reports", {
    params,
  });
};

export const getAllReports = (params: QueryParams) => {
  return apiClient("/service-report/all-reports", {
    params,
  });
};

export const updateReport = (payload: IUpdateReportPayload, id: string) => {
  const formData = new FormData();
  formData.append(
    "data",
    JSON.stringify({
      ...(payload.description !== undefined
        ? { description: payload.description }
        : {}),
    }),
  );
  if (payload.file) {
    formData.append("report", payload.file);
  }

  return apiClient(`/service-report/update/${id}`, {
    method: "PATCH",
    body: formData,
  });
};

export const deleteReport = (id: string) => {
  return apiClient(`/service-report/delete/${id}`, {
    method: "DELETE",
  });
};
