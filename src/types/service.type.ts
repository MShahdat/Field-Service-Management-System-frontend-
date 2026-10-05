import { ICategory } from "./category.types";
import { Address, Priority, ServiceStatus } from "./common.types";
import { IManager } from "./manager.types";
import { IRegion } from "./region.type";

interface IUser {
  id: string;
  name: string;
  email: string;
  profileImg: string;
  status: string;
}

interface ITechnician {
  user: IUser;
}

export interface ServiceRequest {
  id: string;
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
  reviewedBy: string;
  reviewedAt: string;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  customerId: string;
  categoryId: string;
  regionId: string;
  workOrders: {
    id: string;
    technician: ITechnician | null;
    manager: IManager;
    region: IRegion;
  } | null;
  category: ICategory;
}

export interface IServiceCreate {
  description?: string;
  servicingDate: string;
  preferredStartTime: string;
  address: Address;
  categoryId: string;
  priority: Priority;
  regionId: string;
}

export interface IServiceUpdate {
  description: string;
  servicingDate: string;
  preferredStartTime: string;
  address: Address;
  categoryId: string;
  priority: Priority;
  regionId: string;
}
