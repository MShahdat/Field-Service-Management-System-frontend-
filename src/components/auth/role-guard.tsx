"use client";

import { useGetMe } from "@/hooks";
import { UserRole } from "@/types";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import UnauthorizedPage from "./unauthorized";

type IProps = {
  children: ReactNode;
  roles: UserRole[];
};

const RoleGuard = ({ children, roles }: IProps) => {
  const router = useRouter();

  const { data, isError, isPending } = useGetMe();

  const user = data?.data;

  const isAuthorized = !!user && roles.includes(user.role);

  useEffect(() => {
    if (isPending) {
      return;
    }
    if (isError || !user) {
      router.replace("/login");
    }
  }, [data, isPending, isError]);

  if (isPending) {
    return <p>loading....</p>;
  }

  if (isAuthorized) {
    return <>{children}</>;
  }

  return <UnauthorizedPage />;
};

export default RoleGuard;
