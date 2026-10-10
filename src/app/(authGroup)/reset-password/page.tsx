"use client";

import { Suspense } from "react";
import { Logo } from "@/assets/logo";
import { ResetPasswordForm } from "@/components/forms/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted/40 p-6">
      <Logo />
      <Suspense
        fallback={<p className="text-sm text-muted-foreground">loading...</p>}
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
