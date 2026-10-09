import { IWorkOrder } from "./order.types";

export interface IFeedbackPayload {
  workOrderId: string;
  rating: number;
  comment: string;
}

export interface IFeedbackUpdatePayload {
  rating?: number;
  comment?: string;
}

export interface IFeedback {
  id: string;
  rating: number;
  comment: string;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  workOrderId: string;
  workOrder: IWorkOrder;
}
