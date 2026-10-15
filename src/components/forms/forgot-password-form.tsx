"use client";

import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForgotPassword } from "@/hooks";
import { forgotPasswordZodSchema } from "@/validation";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import {
  KeyRoundIcon,
  LockIcon,
  ShieldCheckIcon,
  TimerIcon,
} from "lucide-react";

const getErrorMessage = (err: unknown, fallback: string) => {
  if (err instanceof Error && err.message) return err.message;
  if (typeof err === "string" && err) return err;
  if (
    typeof err === "object" &&
    err !== null &&
    "message" in err &&
    typeof (err as { message: unknown }).message === "string"
  ) {
    return (err as { message: string }).message;
  }
  return fallback;
};

export function ForgotPasswordForm() {
  const { mutate, isPending } = useForgotPassword();
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: forgotPasswordZodSchema,
    },
    onSubmit: ({ value }) => {
      const email = value.email.trim();
      mutate(
        { email },
        {
          onSuccess: (res: { message?: string }) => {
            toast.success(res?.message || "OTP sent to your email");
            localStorage.setItem(
              `otp-expiry-reset-${email}`,
              (Date.now() + 5 * 60 * 1000).toString(),
            );
            const params = new URLSearchParams({ email });
            router.push(`/reset-password?${params.toString()}`);
          },
          onError: (err: unknown) => {
            toast.error(getErrorMessage(err, "Failed to send OTP"));
          },
        },
      );
    },
  });

  return (
    <Card className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border bg-card/95 shadow-xl shadow-primary/[0.06] backdrop-blur">
      <div
        aria-hidden
        className="h-1 w-full bg-gradient-to-r from-primary/60 via-primary to-primary/50"
      />
      <CardHeader className="items-center gap-1 pb-1 text-center">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/[0.08] text-primary ring-1 ring-primary/20 shadow-sm">
          <KeyRoundIcon className="size-6" strokeWidth={1.8} />
        </span>
        <p className="mt-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Password recovery
        </p>
        <CardTitle className="text-xl font-semibold tracking-tight">
          Forgot password
        </CardTitle>
        <CardDescription className="mx-auto max-w-xs text-balance text-[13px] leading-relaxed">
          Enter your account email and we&apos;ll send a 6-digit OTP to reset
          your password.
        </CardDescription>
      </CardHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <CardContent className="px-6 pt-2 sm:px-8">
          <FieldGroup>
            <form.Field name="email">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      htmlFor="email"
                      className="text-[13px] font-medium"
                    >
                      Email
                    </FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="example@gmail.com"
                      autoComplete="email"
                      required
                      className="h-11 rounded-xl bg-background shadow-sm"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex-col gap-3 border-0 bg-transparent px-6 pb-5 pt-3 sm:px-8">
          <Button
            size="lg"
            className="w-full rounded-xl bg-primary text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            disabled={isPending}
            type="submit"
          >
            {isPending ? (
              <>
                <Spinner /> Sending OTP
              </>
            ) : (
              "Send OTP"
            )}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Remembered?{" "}
            <Link
              href="/login"
              className="font-semibold text-foreground underline underline-offset-4"
            >
              Back to login
            </Link>
          </p>
          <div className="flex w-full items-center justify-center gap-4 border-t pt-3 text-[11px] font-medium text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheckIcon className="size-3.5" /> Secure
            </span>
            <span className="size-1 rounded-full bg-border" aria-hidden />
            <span className="inline-flex items-center gap-1.5">
              <LockIcon className="size-3.5" /> Encrypted
            </span>
            <span className="size-1 rounded-full bg-border" aria-hidden />
            <span className="inline-flex items-center gap-1.5">
              <TimerIcon className="size-3.5" /> 5-min code
            </span>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
