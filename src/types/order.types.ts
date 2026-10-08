import { FileAttachmentType } from "./common.types";
import { IManager } from "./manager.types";
import { IPayment } from "./payment.types";
import { ISchedule } from "./schedule.types";
import { ICustomer, IService, IServiceReport } from "./service.type";
import { ITechnician } from "./technician.types";

export type WorkOrderStatus =
  | "SCHEDULED"
  | "EN_ROUTE"
  | "STARTED"
  | "COMPLETED"
  | "CANCELLED";

export interface Feedback {
  id: string;
  rating: number;
  comment: string;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  workOrderId: string;
}

export interface AttachmentFile {
  url: string;
  publicId: string;
}

export interface Attachment {
  id: string;
  files: AttachmentFile[];
  description: string;
  type: FileAttachmentType;
  isDelete: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  workOrderId: string;
}

export interface IWorkOrder {
  id: string;
  servicingDate: string;
  status: WorkOrderStatus;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  regionId: string;
  customerId: string;
  technicianId: string;
  serviceId: string;
  managerId: string;
  customer: ICustomer;
  manager: IManager | null;
  payment: IPayment | null;
  service: IService;
  feedback: Feedback | null;
  attachment: Attachment[];
  schedule: ISchedule | null;
  technician: ITechnician | null;
  serviceReport: IServiceReport | null;
}

type UpdateStatus = "STARTED" | "COMPLETED";

export interface IUpdateOrderStatus {
  workOrderId: string;
  status: UpdateStatus;
}
