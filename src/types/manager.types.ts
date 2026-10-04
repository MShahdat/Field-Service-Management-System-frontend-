import { AuthProvider, UserStatus } from "./auth.types";

export type ManagerVerificationStatus = "PENDING" | "APPROVED" | "REJECTED";
export type ReviewStatus = "APPROVED" | "REJECTED";

interface Address {
  street: string;
  city: string;
  postalCode: string;
}

export interface IManagerApplyPayload {
  user: {
    name: string;
    email: string;
  };
  manager: {
    phone: string;
    address: Address;
    nid: string;
    region: string[];
  };
}

export interface IManager {
  id: string;
  verificationStatus: ManagerVerificationStatus;
  reviewedBy: string | null;
  rejectionReason: string | null;
  phone: string;
  nid: string;
  address: Address;
  userId: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    authProvider: AuthProvider;
    facebookId?: string;
    googleId?: string;
    role: string;
    status: UserStatus;
    profileImg: string;
    profileImgPublicId: string;
    emailVerified: boolean;
  };
  region: [
    {
      area: string;
      description: string;
      id: string;
      isActive: boolean;
    },
  ];
}

export interface IReviewManager {
  email: string;
  verificationStatus: ManagerVerificationStatus;
  rejectionReason?: string;
}
