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
import { RefreshCwIcon } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../ui/input-otp";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useEmailVerify } from "@/hooks";
import { formatMinutesSecond } from "@/utils";

type Mode = "customer" | "technician" | 'manager';

type Props = {
  mode: Mode;
  resendTime: number;
};

const OtpPage = (props: Props) => {
  const params = useSearchParams();
  console.log(params);
  const email = params.get("email");

  if (!email) {
    redirect("/register");
  }

  const [otp, setOtp] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const [resendOtpCount, setResendOtpCount] = useState(0);

  const { mutate, isPending } =
    useEmailVerify();


  useEffect(() => {
    const storageKey = `otp-expiry-${props.mode}-${email}`;
    const savedExpiry = localStorage.getItem(storageKey);

    const now = Date.now();
    let expiryTime: number;

    if (savedExpiry) {
      expiryTime = parseInt(savedExpiry, 10);

      if (expiryTime < now) {
        expiryTime = now + props.resendTime * 1000;
        localStorage.setItem(storageKey, expiryTime.toString());
      }
    } else {
      expiryTime = now + props.resendTime * 1000;
      localStorage.setItem(storageKey, expiryTime.toString());
    }

    const initialRemaining = Math.max(0, Math.ceil((expiryTime - now) / 1000));
    setResendOtpCount(initialRemaining);

    if (initialRemaining < 1) return;

    const timer = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.ceil((expiryTime - Date.now()) / 1000),
      );
      setResendOtpCount(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [email, props.mode, props.resendTime]);

  const handleSubmit = () => {
    if (otp.length !== 6) {
      setIsInvalid(true);
      return;
    }
    const data = {
      email,
      otp,
    };

    console.log(data);

    mutate(data, {
      onSuccess: (res) => {
        localStorage.removeItem(`otp-expiry-${props.mode}-${email}`);
        toast.success(res.message);
          redirect(`/login`);
      },
      onError: (err) => {
        console.log(err);
        toast.error(err.message);
      },
    });
  };

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Verify Your Email</CardTitle>
        <CardDescription>
          Enter the verification code we sent to your email address:{" "}
          <span className="font-semibold text-black">{email}</span>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="otp-form"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSubmit();
          }}
        >
          <Field data-invalid={isInvalid}>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="otp-verification">
                Verification code
              </FieldLabel>
              <Button
                disabled={resendOtpCount > 0}
                type="button"
                variant="outline"
                size="xs"
              >
                <RefreshCwIcon />
                Resend Code
              </Button>
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
            >
              <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator className="mx-2" />
              <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            {isInvalid && (
              <FieldError errors={[{ message: "Must be 6 digit" }]} />
            )}
          </Field>

          <CardDescription
            className={`${resendOtpCount < 1 ? "opacity-0" : "opacity-100"}`}
          >
            Resend in {formatMinutesSecond(resendOtpCount)}
          </CardDescription>
        </form>
      </CardContent>
      <CardFooter>
        <Field>
          <Button
            type="submit"
            disabled={resendOtpCount < 1}
            form="otp-form"
            className="w-full"
          >
            {isPending ? (
              <>
                <Spinner /> Verify
              </>
            ) : (
              "Verify"
            )}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};

export default OtpPage;
