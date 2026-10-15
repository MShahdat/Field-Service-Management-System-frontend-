"use client";

import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/forms/reset-password-form";
import Header from "@/components/module/auth/header";
import { CardSkeleton } from "@/loading";
import Link from "next/link";

export default function ResetPasswordPage() {
  return (
    <div>
      <Header />
      <div className="max-w-md mx-auto flex flex-col items-center justify-center">
        <Suspense fallback={<CardSkeleton />}>
          <ResetPasswordForm />
        </Suspense>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Protected by FieldDesk secure verification
          <span className="mx-2 text-border">•</span>
          <Link href="/contact" className="underline-offset-4 hover:underline">
            Privacy
          </Link>
          <span className="mx-2 text-border">•</span>
          <Link href="/contact" className="underline-offset-4 hover:underline">
            Terms
          </Link>
        </p>
      </div>
    </div>
  );
}
