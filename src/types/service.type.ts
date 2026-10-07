import { ICategory } from "./category.types";
import {
  Address,
  FileAttachmentType,
  PaymentStatus,
  Priority,
  ScheduleStatus,
  ServiceStatus,
  WorkOrderStatus,
} from "./common.types";
import { IRegion } from "./region.type";
import { ITechnician } from "./technician.types";

export interface IUser {
  id: string;
  name: string;
  email: string;
  profileImg: string;
  status: string;
  emailVerified: boolean;
}

export interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: ServiceStatus;
  address: Address;
  servicingDate: string;
  preferredStartTime: string;
  preferredEndTime: string;
  duration: number;
  rejectionReason: string | null;
  workOrders: {
    id: string;
    technician: ITechnician | null;
  } | null;
  category: ICategory;
  region: IRegion;
}

export interface IServiceCreate {
  title: string;
  description?: string;
  servicingDate: string;
  preferredStartTime: string;
  address: Address;
  categoryId: string;
  priority: Priority;
  regionId: string;
}

export interface IServiceUpdate {
  title: string;
  description: string;
  servicingDate: string;
  preferredStartTime: string;
  address: Address;
  categoryId: string;
  priority: Priority;
  regionId: string;
}

export interface Payment {
  id: string;
  paymentId: string;
  amount: string;
  method: string;
  transectionId: string;
  status: PaymentStatus;
  paidAt: string;
  payerReference: string;
  currency: string;
  merchantInvoiceNumber: string;
  refundTrxId: string | null;
  refundAmount: string | null;
  refundedAt: string | null;
  reason: string | null;
  createdAt: string;
  updatedAt: string;
  workOrderId: string;
}

export interface Manager {
  id: string;
  phone: string;
  address: Address;
  nid: string;
  userId: string;
  user: IUser;
}

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

export interface Schedule {
  id: string;
  servicingDate: string;
  startTime: string;
  endTime: string;
  actualStart: string | null;
  actualEnd: string | null;
  status: ScheduleStatus;
  isdeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  technicianId: string;
  workOrderId: string;
}

export interface ServiceReport {
  id: string;
  reportUrl: string;
  reportPublicId: string;
  description: string | null;
  isDelete: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  workOrderId: string;
}

export interface ICustomer {
  id: string;
  phone: string | null;
  address: Address | null;
  userId: string;
  user: IUser;
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
  technicianId: string | null;
  serviceId: string;
  managerId: string;

  payment: Payment;
  manager: Manager;
  feedback: Feedback | null;
  attachment: Attachment[];
  schedule: Schedule | null;
  technician: ITechnician | null;
  serviceReport: ServiceReport | null;
}

export interface IService {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: ServiceStatus;

  address: Address;

  servicingDate: string;
  preferredStartTime: string;
  preferredEndTime: string;
  duration: number;

  isDeleted: boolean;
  isDeletedAt: string | null;

  assignedAt: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;

  createdAt: string;
  updatedAt: string;

  customerId: string;
  categoryId: string;
  regionId: string;

  workOrders: IWorkOrder | null;
  category: ICategory;
  region: IRegion;
  customer: ICustomer;
}

type Status = "REJECTED" | "ASSIGNED";

export interface IAvailability {
  id: string;
  type: string;
  dayOfWeek: number;
  date: string;
  startTime: string;
  endTime: string;
}

export interface IEligibleTechnician {
  eligibleTech: ITechnician[];
}

export interface IAssignTechnician {
  workOrderId: string;
  technicianId: string;
  amount: number;
  status: Status;
  rejectionReason?: string;
}
