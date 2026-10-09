import { FileAttachmentType } from "./common.types";
import { IWorkOrder } from "./order.types";

interface AttatchmentData {
  workOrderId: string;
  description?: string;
  type: FileAttachmentType;
}

export interface IAttachmentPayload {
  data: AttatchmentData;
  attatchment: File[];
}

export interface IUpdateAttachmentPayload {
  description?: string;
  type?: FileAttachmentType;
}

export interface AttachmentFile {
  url: string;
  publicId: string;
}

export interface IAttachment {
  id: string;
  files: AttachmentFile[];
  description: string;
  type: FileAttachmentType;
  isDelete: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  workOrderId: string;
  workOrder: IWorkOrder;
  // Optional owner info (when backend returns it).
  // Enables strict per-attachment authz; falls back to workOrder ownership.
  uploadedById?: string | null;
  customerId?: string | null;
  technicianId?: string | null;
}
