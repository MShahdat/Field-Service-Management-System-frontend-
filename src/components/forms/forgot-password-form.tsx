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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";

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
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Forgot password</CardTitle>
        <CardDescription>
          Enter your email, we will send a 6-digit OTP
        </CardDescription>
      </CardHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <CardContent>
          <FieldGroup>
            <form.Field name="email">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="example@gmail.com"
                      autoComplete="email"
                      required
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
        <CardFooter className="mt-4 flex-col gap-4">
          <Button disabled={isPending} type="submit" className="w-full">
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
        </CardFooter>
      </form>
    </Card>
  );
}
