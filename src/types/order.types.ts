import { IAttachment } from "./attatchment.types";
import { FileAttachmentType } from "./common.types";
import { IFeedback } from "./feedback.type";
import { IManager } from "./manager.types";
import { IPayment } from "./payment.types";
import { IServiceReport } from "./report.types";
import { ISchedule } from "./schedule.types";
import { ICustomer, IService } from "./service.type";
import { ITechnician } from "./technician.types";

export type WorkOrderStatus =
  | "SCHEDULED"
  | "EN_ROUTE"
  | "STARTED"
  | "COMPLETED"
  | "CANCELLED";

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
  feedback: IFeedback | null;
  attachment: IAttachment[];
  schedule: ISchedule | null;
  technician: ITechnician | null;
  serviceReport: IServiceReport | null;
}

type UpdateStatus = "STARTED" | "COMPLETED";

export interface IUpdateOrderStatus {
  workOrderId: string;
  status: UpdateStatus;
}
