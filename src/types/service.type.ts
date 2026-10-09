import { ICategory } from "./category.types";
import {
  Address,
  AuthProvider,
  FileAttachmentType,
  PaymentStatus,
  Priority,
  ScheduleStatus,
  ServiceStatus,
  UserRole,
  UserStatus,
} from "./common.types";
import { IWorkOrder } from "./order.types";
import { IRegion } from "./region.type";
import { ITechnician } from "./technician.types";

export interface IUser {
  id: string;
  name: string;
  email: string;
  profileImg: string;
  status: UserStatus;
  emailVerified: boolean;
  isDeleted: boolean;
  role: UserRole;
  authProvider: AuthProvider;
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

export interface ICustomer {
  id: string;
  phone: string | null;
  address: Address | null;
  userId: string;
  user: IUser;
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
