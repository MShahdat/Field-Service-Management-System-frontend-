"use client";

import { useForm } from "@tanstack/react-form";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  Eye,
  EyeClosed,
  LockKeyholeIcon,
  RefreshCwIcon,
  ShieldCheckIcon,
  LockIcon,
  TimerIcon,
} from "lucide-react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForgotPassword, useResetPassword } from "@/hooks";
import { formatMinutesSecond } from "@/utils";
import { resetPasswordZodSchema } from "@/validation";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../ui/input-otp";
import { Spinner } from "../ui/spinner";

function PasswordField({
  form,
  name,
  label,
}: {
  form: any;
  name: "newPassword" | "confirmPassword";
  label: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <form.Field name={name}>
      {(field: any) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid;
        return (
          <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor={name} className="text-[13px] font-medium">
              {label}
            </FieldLabel>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShow(!show)}
                aria-label={show ? "Hide password" : "Show password"}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {!show ? (
                  <EyeClosed className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
              <Input
                id={name}
                type={!show ? "password" : "text"}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="********"
                autoComplete="new-password"
                className="h-9 rounded-xl bg-background pr-10 shadow-sm"
                required
              />
            </div>
            {isInvalid && <FieldError errors={field.state.meta.errors} />}
          </Field>
        );
      }}
    </form.Field>
  );
}

export function ResetPasswordForm() {
  const params = useSearchParams();
  const email = params.get("email");
  const router = useRouter();
  const { mutate, isPending } = useResetPassword();
  const { mutate: resend, isPending: isResending } = useForgotPassword();

  const OTP_VALIDITY_SECONDS = 5 * 60;
  const [timeLeft, setTimeLeft] = useState(0);

  if (!email) {
    redirect("/forgot-password");
  }

  const storageKey = `otp-expiry-reset-${email}`;

  useEffect(() => {
    if (!email) return;
    const savedExpiry = localStorage.getItem(storageKey);
    if (!savedExpiry) {
      setTimeLeft(0);
      return;
    }
    const expiryTime = parseInt(savedExpiry, 10);
    if (Number.isNaN(expiryTime)) {
      setTimeLeft(0);
      return;
    }
    const remaining = Math.max(0, Math.ceil((expiryTime - Date.now()) / 1000));
    setTimeLeft(remaining);
    if (remaining <= 0) return;

    const timer = setInterval(() => {
      const left = Math.max(0, Math.ceil((expiryTime - Date.now()) / 1000));
      setTimeLeft(left);
      if (left <= 0) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [email, storageKey]);

  const handleResend = () => {
    resend(
      { email },
      {
        onSuccess: (r: { message: string }) => {
          const newExpiry = Date.now() + OTP_VALIDITY_SECONDS * 1000;
          localStorage.setItem(storageKey, newExpiry.toString());
          setTimeLeft(OTP_VALIDITY_SECONDS);
          toast.success(r.message);
        },
        onError: (er: Error) => toast.error(er.message),
      },
    );
  };

  const form = useForm({
    defaultValues: {
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: resetPasswordZodSchema,
    },
    onSubmit: ({ value }) => {
      mutate(
        {
          email,
          otp: value.otp,
          newPassword: value.newPassword,
        },
        {
          onSuccess: (res: { message: string }) => {
            toast.success(res.message);
            localStorage.removeItem(storageKey);
            form.reset();
            router.push("/login");
          },
          onError: (err: Error) => {
            toast.error(err.message || "Reset failed");
          },
        },
      );
    },
  });

  const progress = Math.min(
    100,
    Math.max(0, (timeLeft / OTP_VALIDITY_SECONDS) * 100),
  );

  return (
    <Card className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border bg-card/95 shadow-xl shadow-primary/[0.06] backdrop-blur">
      <div
        aria-hidden
        className="h-1 w-full bg-gradient-to-r from-primary/60 via-primary to-primary/50"
      />
      <CardHeader className="items-center gap-1 pb-1 text-center">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/[0.08] text-primary ring-1 ring-primary/20 shadow-sm">
          <LockKeyholeIcon className="size-6" strokeWidth={1.8} />
        </span>
        <p className=" text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Reset password
        </p>
        <CardDescription className="mx-auto max-w-xs text-balance text-[13px] leading-relaxed">
          Code sent to
          <span className="mx-auto mt-1.5 block truncate rounded-full border bg-muted/60 px-3 py-1 text-[13px] font-medium text-foreground">
            {email}
          </span>
        </CardDescription>
      </CardHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <CardContent className="px-6 sm:px-8">
          <FieldGroup className="gap-4">
            <form.Field name="otp">
              {(field: any) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <div className="flex items-center justify-between">
                      <FieldLabel className="text-[13px] font-medium">
                        OTP code
                      </FieldLabel>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={isResending || timeLeft > 0}
                        onClick={handleResend}
                        className="h-7 gap-1.5 rounded-full px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground disabled:opacity-60"
                      >
                        <RefreshCwIcon
                          className={`size-3.5 ${isResending ? "animate-spin" : ""}`}
                        />
                        {isResending ? "Sending..." : "Resend Code"}
                      </Button>
                    </div>
                    <InputOTP
                      maxLength={6}
                      value={field.state.value}
                      onChange={(v) => field.handleChange(v)}
                      onBlur={field.handleBlur}
                      pattern={REGEXP_ONLY_DIGITS}
                      containerClassName="w-full gap-2 sm:gap-2.5"
                    >
                      <InputOTPGroup className="flex-1 *:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-full *:data-[slot=input-otp-slot]:flex-1 *:data-[slot=input-otp-slot]:text-xl">
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator className="shrink-0 text-muted-foreground/50" />
                      <InputOTPGroup className="flex-1 *:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-full *:data-[slot=input-otp-slot]:flex-1 *:data-[slot=input-otp-slot]:text-xl">
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                    <div className="rounded-xl border bg-muted/40 px-3.5 py-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="inline-flex items-center gap-1.5 font-medium text-muted-foreground">
                          <TimerIcon className="size-3.5" />
                          {timeLeft > 0 ? "Code expires in" : "Code expired"}
                        </span>
                        <span
                          className={`font-semibold tabular-nums ${timeLeft > 0 ? "text-foreground" : "text-destructive"}`}
                        >
                          {timeLeft > 0
                            ? `${formatMinutesSecond(timeLeft)} (5 min)`
                            : "Expired"}
                        </span>
                      </div>
                      <div
                        role="progressbar"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.round(progress)}
                        className="mt-2 h-1 overflow-hidden rounded-full bg-muted"
                      >
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary/70 to-primary transition-[width] duration-1000"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      {timeLeft <= 0 && (
                        <p className="mt-2 text-xs text-destructive">
                          Code expired — click Resend Code to get a new one.
                        </p>
                      )}
                    </div>
                  </Field>
                );
              }}
            </form.Field>
            <PasswordField
              form={form}
              name="newPassword"
              label="New password"
            />
            <PasswordField
              form={form}
              name="confirmPassword"
              label="Confirm password"
            />
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex-col gap-3 border-0 bg-transparent px-6 pb-5 pt-4 sm:px-8">
          <form.Subscribe
            selector={(state) => [
              state.values.otp,
              state.values.newPassword,
              state.values.confirmPassword,
            ]}
          >
            {([otp, newPassword, confirmPassword]) => {
              const isComplete =
                (otp?.length ?? 0) === 6 && !!newPassword && !!confirmPassword;
              const isExpired = timeLeft <= 0;
              return (
                <Button
                  disabled={isPending || !isComplete || isExpired}
                  type="submit"
                  size="lg"
                  className="w-full rounded-xl bg-primary text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                >
                  {isPending ? (
                    <>
                      <Spinner /> Resetting
                    </>
                  ) : (
                    "Reset password"
                  )}
                </Button>
              );
            }}
          </form.Subscribe>
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
              <TimerIcon className="size-3.5" /> Auto-expires
            </span>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
