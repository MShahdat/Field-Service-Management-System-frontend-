import { Logo } from "@/assets/logo";
import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";
import { Suspense } from "react";

export default function ForgotPasswordPage() {
  return (
     <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted/40 p-6">
          <Logo />
          <Suspense
            fallback={<p className="text-sm text-muted-foreground">loading...</p>}
          >
            <ForgotPasswordForm />
          </Suspense>
        </div>
  );
}
