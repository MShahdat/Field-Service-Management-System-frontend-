import type {
  Address,
  AuthProvider,
  UserRole,
  UserStatus,
} from "./common.types";
import type { IRegion } from "./region.type";
import type { IUser } from "./service.type";
import type { ISkills } from "./skills.types";

export type ITechStatus = "AVAILABLE" | "BUSY" | "OFF_DUTY";

export type AvailabilityType = "RECURRING" | "ONE_OFF" | "BLOCKED";

export interface IAvailability {
  id: string;
  type: AvailabilityType;
  dayOfWeek: number | null;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  technicianId: string;
  technician: ITechnician;
}

export interface ITechnician {
  id: string;
  phone: string;
  address: Address;
  bio: string;
  nid: string;
  isProfileCompleted: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
  status: ITechStatus;
  rating: number;
  jobsCompleted: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: IUser;
  availability: IAvailability[];
  regions: IRegion[];
  skills: ISkills[];
}

export interface IAvailabilityInput {
  // Existing row → update in place; absent → create new.
  // Rows missing from the payload are deleted (replace semantics).
  id?: string;
  type: AvailabilityType;
  dayOfWeek?: number;
  date?: string; // ISO date string, e.g. "2026-09-10"
  startTime?: string; // "09:00"
  endTime?: string; // "17:00"
}

export interface ITechnicianProfileComplete {
  phone?: string;
  nid?: string;
  address?: Address;
  bio?: string;
  skills?: string[];
  availability?: IAvailabilityInput[];
  region?: string[];
}

export interface ITechnicianPublicUser {
  id: string;
  name: string;
  email: string;
  profileImg?: string | null;
  status?: UserStatus;
  emailVerified?: boolean;
  role?: UserRole;
  authProvider?: AuthProvider;
  isDeleted?: boolean;
}

export interface ITechnicianPublicSkill {
  id: string;
  name: string;
  icon?: string | null;
}

export interface ITechnicianPublicRegion {
  id: string;
  area: string;
}

export interface ITechnicianPublicAvailability {
  id: string;
  type: AvailabilityType;
  dayOfWeek: number | null;
  date?: string | null;
  startTime: string | null;
  endTime: string | null;
}

export interface ITechnicianPublic {
  id: string;
  phone: string | null;
  address: Address | null;
  bio: string | null;
  nid: string | null;
  isProfileCompleted: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
  status: ITechStatus;
  rating: number | null;
  jobsCompleted: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: ITechnicianPublicUser;
  skills: ITechnicianPublicSkill[];
  regions: ITechnicianPublicRegion[];
  availability: ITechnicianPublicAvailability[];
}

export interface ITechnicianDetail extends ITechnicianPublic {
  user: ITechnicianPublicUser & {
    profileImg: string | null;
    status: UserStatus;
    emailVerified: boolean;
    role: UserRole;
    authProvider: AuthProvider;
    isDeleted: boolean;
  };
}
