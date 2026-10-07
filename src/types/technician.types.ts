import { Address } from "./common.types";
import { IRegion } from "./region.type";
import { IUser } from "./service.type";

export type ITechStatus = "AVAILABLE" | "BUSY" | "OFF_DUTY";

export type IAvailability = "RECURRING" | "ONE_OFF" | "BLOCKED";

export interface ITechnician {
  id: string;
  phone: string;
  address: Address;
  bio: string;
  nid: string;
  isProfileCompleted: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
  status: ITechStatus | string;
  rating: number;
  jobsCompleted: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: IUser;
  availability: IAvailability[];
  regions: IRegion[];
}
