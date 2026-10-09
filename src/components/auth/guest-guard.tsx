"use client";

import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useGetMe } from "@/hooks";
import { getDashboardUrl } from "@/utils";

type IProps = {
  children: ReactNode;
};

// Routes that stay accessible even when logged in (e.g. OTP verification step).
const GUEST_GUARD_ALLOWLIST = ["/register/email-verify"];

const GuestGuard = ({ children }: IProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data, isError, isPending } = useGetMe();

  const user = data?.data;
  const dashboardUrl = getDashboardUrl(user?.role);

  const isAllowlisted = GUEST_GUARD_ALLOWLIST.some((route) =>
    pathname?.startsWith(route),
  );

  useEffect(() => {
    if (isPending || isAllowlisted) {
      return;
    }
    if (!isError && user && dashboardUrl) {
      router.replace(dashboardUrl);
    }
  }, [isPending, isError, user, dashboardUrl, router, isAllowlisted]);

  if (isAllowlisted) {
    return <>{children}</>;
  }

  if (isPending) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-sm text-muted-foreground">loading....</p>
      </div>
    );
  }

  if (!isError && user && dashboardUrl) {
    return null;
  }

  return <>{children}</>;
};

export default GuestGuard;
