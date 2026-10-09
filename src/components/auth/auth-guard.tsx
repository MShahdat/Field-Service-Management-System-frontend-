"use client";

import { useGetMe } from "@/hooks";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

const AuthGuards = ({ children }: { children: ReactNode }) => {
  const { data, isError, isPending } = useGetMe();
  const user = data?.data;

  const router = useRouter();

  useEffect(() => {
    if (isPending) {
      return;
    }
    if (isError || !user) {
      router.replace("/login");
    }
  }, [isError, user, isPending]);

  if (isPending) {
    return <p>loading....</p>;
  }

  return <>{children}</>;
};

export default AuthGuards;
