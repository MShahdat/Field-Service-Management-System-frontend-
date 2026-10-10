import { AuthProvider, UserRole, UserStatus } from "./common.types";
import { IManager } from "./manager.types";
import { ICustomer } from "./service.type";
import { ITechnician } from "./technician.types";

export type RegisterRole = "CUSTOMER" | "TECHNICIAN";

export interface IUserLogin {
  email: string;
  password: string;
}

export interface ILoggedUser {
  id: string;
  name: string;
  email: string;
  authProvider: AuthProvider;
  role: UserRole;
  emailVerified: boolean;
  googleId?: string;
  facebookId?: string;
  profileImg?: string;
  profileImgPublicId?: string;
  status: UserStatus;
  customer: ICustomer;
  technician: ITechnician;
  manager: IManager;
}




export interface IForgotPasswordPayload {
	email: string;
}

export interface IResetPasswordPayload {
	email: string;
	newPassword: string;
	otp: string;
}