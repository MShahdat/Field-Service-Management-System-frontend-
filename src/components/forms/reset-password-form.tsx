"use client";

import { useForm } from "@tanstack/react-form";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Eye, EyeClosed, RefreshCwIcon } from "lucide-react";
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
import { Separator } from "../ui/separator";

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
            <FieldLabel htmlFor={name}>{label}</FieldLabel>
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
                className="pr-10"
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
      email,
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
          email: value.email.trim(),
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

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>Reset password</CardTitle>
        <CardDescription>
          Code sent to{" "}
          <span className="font-semibold text-foreground">{email}</span>. Enter
          OTP + new password, then login manually.
        </CardDescription>
      </CardHeader>
      <Separator/>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <CardContent>
          <FieldGroup>
            <form.Field name="email">
              {(field: any) => (
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    type="email"
                    value={field.state.value}
                    disabled
                    readOnly
                  />
                </Field>
              )}
            </form.Field>
            <form.Field name="otp">
              {(field: any) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <div className="flex items-center justify-between">
                      <FieldLabel>OTP code</FieldLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="xs"
                        disabled={isResending || timeLeft > 0}
                        onClick={handleResend}
                      >
                        <RefreshCwIcon />
                        {isResending ? "Sending..." : "Resend Code"}
                      </Button>
                    </div>
                    <InputOTP
                      maxLength={6}
                      value={field.state.value}
                      onChange={(v) => field.handleChange(v)}
                      onBlur={field.handleBlur}
                      pattern={REGEXP_ONLY_DIGITS}
                      containerClassName="w-full gap-2"
                    >
                      <InputOTPGroup className="flex-1 *:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-full *:data-[slot=input-otp-slot]:flex-1 *:data-[slot=input-otp-slot]:text-xl">
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator className="shrink-0" />
                      <InputOTPGroup className="flex-1 *:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-full *:data-[slot=input-otp-slot]:flex-1 *:data-[slot=input-otp-slot]:text-xl">
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                    {timeLeft > 0 ? (
                      <CardDescription>
                        Code expires in {formatMinutesSecond(timeLeft)} (valid
                        for 5 min)
                      </CardDescription>
                    ) : (
                      <CardDescription className="text-destructive">
                        Code expired — click Resend Code to get a new one.
                      </CardDescription>
                    )}
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
        <CardFooter>
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
                  className="w-full"
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
        </CardFooter>
      </form>
    </Card>
  );
}
