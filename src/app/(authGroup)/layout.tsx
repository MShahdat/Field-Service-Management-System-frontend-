import type { ReactNode } from "react";
import GuestGuard from "@/components/auth/guest-guard";

const AuthGroupLayout = ({ children }: { children: ReactNode }) => {
  return <GuestGuard>{children}</GuestGuard>;
};

export default AuthGroupLayout;
