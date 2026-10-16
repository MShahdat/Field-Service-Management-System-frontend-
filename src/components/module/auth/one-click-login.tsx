"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useLogin } from "@/hooks";
import { getDashboardUrl } from "@/utils";

export interface DemoAccount {
  label: string;
  email: string;
  password: string;
}


const OneClickLogin = ({ accounts }: { accounts: DemoAccount[] }) => {
  const [activeDemoEmail, setActiveDemoEmail] = useState<string | null>(null);
  const { mutate, isPending } = useLogin();
  const router = useRouter();

  if (accounts.length === 0) {
    return null;
  }

  const handleDemoLogin = (account: DemoAccount) => {
    if (isPending) return;
    setActiveDemoEmail(account.email);
    mutate(
      { email: account.email, password: account.password },
      {
        onSuccess: (res) => {
          toast.success(res.message);
          setActiveDemoEmail(null);
          const dashboardUrl = getDashboardUrl(res?.data?.user?.role);
          router.push(dashboardUrl ?? "/");
          router.refresh();
        },
        onError: (err: Error) => {
          setActiveDemoEmail(null);
          toast.error(err.message || "Login failed");
        },
      },
    );
  };

  return (
    <div className="rounded-lg border border-primary/20 bg-muted/50 p-3">
      <p className="text-center text-sm font-semibold text-foreground">
        Quick demo access for recruiters
      </p>
      <p className="mb-3 text-center text-xs text-muted-foreground">
        One click to explore the full project
      </p>
      <div className="grid grid-cols-3 gap-2">
        {accounts.map((account) => {
          const isLoading = isPending && activeDemoEmail === account.email;
          return (
            <Button
              key={account.email}
              type="button"
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={() => handleDemoLogin(account)}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Spinner /> {account.label}...
                </>
              ) : (
                `${account.label}`
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default OneClickLogin;
