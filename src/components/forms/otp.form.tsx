"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Button } from "../ui/button";
import {
  ArrowLeftIcon,
  ClockIcon,
  LockIcon,
  MailCheckIcon,
  RefreshCwIcon,
  ShieldCheckIcon,
  TimerIcon,
} from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../ui/input-otp";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  useEmailVerify,
  useMangerEmailVerify,
  useManagerResendOtp,
  useUserResendOtp,
} from "@/hooks";
import { formatMinutesSecond } from "@/utils";

type Role = "customer" | "technician" | "manager";

const OtpPage = () => {
  const params = useSearchParams();
  const email = params.get("email");
  const role = (params.get("role") as Role | null) ?? "customer";

  const router = useRouter();

  useEffect(() => {
    if (!email) {
      router.push("/register");
    }
  }, [email, router]);

  const [otp, setOtp] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const [resendOtpCount, setResendOtpCount] = useState(0);
  const [timerEpoch, setTimerEpoch] = useState(0);

  const { mutate: userVerify, isPending: isUserPending } = useEmailVerify();
  const { mutate: managerVerify, isPending: isManagerPending } =
    useMangerEmailVerify();
  const { mutate: userResend, isPending: isUserResending } = useUserResendOtp();
  const { mutate: managerResend, isPending: isManagerResending } =
    useManagerResendOtp();

  const verify = role === "manager" ? managerVerify : userVerify;
  const resend = role === "manager" ? managerResend : userResend;
  const isResending = isUserResending || isManagerResending;

  // Must match backend Redis TTL: register OTP = 5 min, manager OTP = 60 min.
  const resendTime = role === "manager" ? 60 * 60 : 5 * 60;

  const storageKey = useMemo(
    () => (email ? `otp-expiry-${role}-${email}` : null),
    [email, role],
  );

  useEffect(() => {
    if (!email || !storageKey) {
      setResendOtpCount(0);
      return;
    }
    // Never auto-create a countdown here: the timer runs only if a previous
    // successful OTP send stored an expiry. After expiry (incl. hard refresh)
    // the timer stays at 0 until a successful resend.
    const savedExpiry = localStorage.getItem(storageKey);
    if (!savedExpiry) {
      setResendOtpCount(0);
      return;
    }
    const expiryTime = parseInt(savedExpiry, 10);
    if (Number.isNaN(expiryTime)) {
      localStorage.removeItem(storageKey);
      setResendOtpCount(0);
      return;
    }
    const initialRemaining = Math.max(
      0,
      Math.ceil((expiryTime - Date.now()) / 1000),
    );
    setResendOtpCount(initialRemaining);

    if (initialRemaining < 1) {
      localStorage.removeItem(storageKey);
      return;
    }

    const timer = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.ceil((expiryTime - Date.now()) / 1000),
      );
      setResendOtpCount(remaining);

      if (remaining <= 0) {
        localStorage.removeItem(storageKey);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [email, storageKey, timerEpoch]);

  const handleSubmit = () => {
    if (otp.length !== 6) {
      setIsInvalid(true);
      return;
    }
    if (resendOtpCount < 1) {
      toast.error("Code expired — please resend a new code first");
      return;
    }
    const data = {
      email: email as string,
      otp,
    };

    verify(data, {
      onSuccess: (res) => {
        if (storageKey) localStorage.removeItem(storageKey);

        if (res.data?.role === "manager") {
          router.push("/login");
        } else if (res.data?.role === "customer") {
          router.push("/customer-dashboard");
        } else if (res.data?.role === "technician") {
          router.push("/technician-dashboard");
        } else {
          router.push("/login");
        }
        router.refresh();
      },
      onError: (err) => {
        console.log(err);
        toast.error(err.message);
      },
    });
  };

  const isVerifying = isManagerPending || isUserPending;
  const isExpired = resendOtpCount < 1;
  const isComplete = otp.length === 6;
  const progress = Math.min(
    100,
    Math.max(0, (resendOtpCount / resendTime) * 100),
  );

  return (
    <div>
      <Card className="overflow-hidden rounded-2xl border bg-card/95 shadow-xl shadow-primary/[0.06] backdrop-blur">
        <div
          aria-hidden
          className="h-1 w-full bg-gradient-to-r from-primary/60 via-primary to-primary/50"
        />

        <CardHeader className="items-center gap-1 pb-1 text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/[0.08] text-primary ring-1 ring-primary/20 shadow-sm">
            <MailCheckIcon className="size-6" strokeWidth={1.8} />
          </span>
          <p className="mt-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Email verification
          </p>
          <CardTitle className="text-xl font-semibold tracking-tight">
            Check your inbox
          </CardTitle>
          <CardDescription className="max-w-xs mx-auto text-balance text-[13px] leading-relaxed">
            We sent a 6-digit code to
            <span className="mt-1.5 block truncate rounded-full border bg-muted/60 px-3 py-1 text-[13px] font-medium text-foreground mx-auto">
              {email}
            </span>
            <span className="mt-1.5 block text-xs">
              Wrong address?{" "}
              <Link
                href="/register"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Change email
              </Link>
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-0 pt-2 sm:px-8">
          <form
            id="otp-form"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSubmit();
            }}
            className="space-y-3"
          >
            <Field data-invalid={isInvalid}>
              <div className="flex items-center justify-between">
                <FieldLabel
                  htmlFor="otp-verification"
                  className="text-[13px] font-medium"
                >
                  Verification code
                </FieldLabel>
              </div>
              <InputOTP
                onChange={(val) => {
                  setOtp(val);
                  if (isInvalid) {
                    setIsInvalid(false);
                  }
                }}
                maxLength={6}
                id="otp-verification"
                name="otp"
                value={otp}
                pattern={REGEXP_ONLY_DIGITS}
                required
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
                <FieldError
                  errors={[{ message: "Please enter all 6 digits" }]}
                />
              )}
            </Field>

            {/* Expiry pill + progress */}
            <div className="rounded-xl border bg-muted/40 px-3.5 py-2">
              <div className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 font-medium text-muted-foreground">
                  <TimerIcon className="size-3.5" />
                  {isExpired ? "Code expired" : "Code expires in"}
                </span>
                <span
                  className={`font-semibold tabular-nums ${isExpired ? "text-destructive" : "text-foreground"}`}
                >
                  {isExpired ? "Expired" : formatMinutesSecond(resendOtpCount)}
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
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-3 border-0 bg-transparent px-6 pb-5 pt-1 sm:px-8">
          <Field className="-mt-1 w-full gap-1.5">
            <Button
              size="lg"
              type="submit"
              disabled={isVerifying || !isComplete || isExpired}
              form="otp-form"
            >
              {isVerifying ? (
                <>
                  <Spinner /> Verifying…
                </>
              ) : (
                "Verify email"
              )}
            </Button>
            <p className="mt-1.5 text-center text-xs text-muted-foreground">
              {isExpired
                ? "Code expired — click Resend code to get a new one."
                : "Didn't get the code? Check spam, or wait for the timer to resend."}
            </p>
          </Field>

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
              <ClockIcon className="size-3.5" /> Auto-expires
            </span>
          </div>
        </CardFooter>
      </Card>

      <Link
        href="/login"
        className="mx-auto mt-3 flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4" />
        Back to sign in
      </Link>
    </div>
  );
};

export default OtpPage;
