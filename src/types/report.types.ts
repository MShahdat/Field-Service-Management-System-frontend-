import { IWorkOrder } from "./order.types";

export interface IReportPayload {
  workOrderId: string;
  description?: string;
  file: File;
}

export interface IUpdateReportPayload {
  description?: string;
  file?: File;
}

export interface IServiceReport {
  id: string;
  reportUrl: string;
  reportPublicId: string;
  description: string | null;
  isDelete: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  workOrderId: string;
  workOrder: IWorkOrder;
}
