"use client";

import { useForm } from "@tanstack/react-form";
import {
  Eye,
  EyeClosed,
  LockIcon,
  MailCheckIcon,
  ShieldCheckIcon,
  UserPlusIcon,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRegister } from "@/hooks";
import { registerZodSchema } from "@/validation";
import FacebookAuth from "../auth/facebook-auth";
import GoogleAuth from "../auth/google-auth";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Spinner } from "../ui/spinner";

export function RegisterForm() {
  const [showPass, setShowPass] = useState(false);
  const { mutate, isPending } = useRegister();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "CUSTOMER",
    },
    validators: {
      onSubmit: registerZodSchema,
    },
    onSubmit: ({ value }) => {
      console.log(value);
      const data = {
        name: value.name,
        email: value.email,
        password: value.password,
        role: value.role,
      };

      console.log("data", data);
      mutate(data, {
        onSuccess: (res) => {
          toast.success(res.message);
          // Start the OTP countdown only after the OTP email was sent.
          const roleKey = value.role.toLowerCase();
          localStorage.setItem(
            `otp-expiry-${roleKey}-${value.email}`,
            (Date.now() + 5 * 60 * 1000).toString(),
          );
          const params = new URLSearchParams({ email: value.email });
          redirect(
            `/register/email-verify?${params.toString()}&role=${value.role.toLowerCase()}`,
          );
        },
        onError: (err) => {
          console.log(err);
          toast.error(err.message);
        },
      });
    },
  });

  return (
    <Card className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border bg-card/95 shadow-xl shadow-primary/[0.06] backdrop-blur">
      <div
        aria-hidden
        className="h-1 w-full bg-gradient-to-r from-primary/60 via-primary to-primary/50"
      />
      <CardHeader className="items-center gap-1 pb-1 text-center">
        <CardTitle className="text-xl font-semibold tracking-tight">
          Create your account
        </CardTitle>
        <CardDescription className="mx-auto max-w-xs text-balance text-[13px] leading-relaxed">
          Fill in the form below to create your account
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
            <form.Field name="name">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      htmlFor="name"
                      className="text-[13px] font-medium"
                    >
                      Full Name<span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      autoComplete="off"
                      placeholder="John Doe"
                      required
                      className="h-9 rounded-xl bg-background shadow-sm"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
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
                      Email<span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="off"
                      placeholder="m@example.com"
                      required
                      className="h-9 rounded-xl bg-background shadow-sm"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
            <div className="flex gap-2">
              <form.Field name="password">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <div className="flex items-center">
                        <FieldLabel
                          htmlFor="password"
                          className="text-[13px] font-medium"
                        >
                          Password<span className="text-red-500">*</span>
                        </FieldLabel>
                      </div>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowPass(!showPass)}
                          aria-label={
                            showPass ? "Hide password" : "Show password"
                          }
                          className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {!showPass ? (
                            <EyeClosed className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </button>
                        <Input
                          id={field.name}
                          type={!showPass ? "password" : "text"}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          autoComplete="off"
                          placeholder="********"
                          required
                          className="h-9 rounded-xl bg-background pr-10 shadow-sm"
                        />
                      </div>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="confirmPassword">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <div className="flex items-center">
                        <FieldLabel
                          htmlFor="password"
                          className="text-[13px] font-medium"
                        >
                          Confirm Password
                          <span className="text-red-500">*</span>
                        </FieldLabel>
                      </div>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowPass(!showPass)}
                          aria-label={
                            showPass ? "Hide password" : "Show password"
                          }
                          className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {!showPass ? (
                            <EyeClosed className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </button>
                        <Input
                          id={field.name}
                          type={!showPass ? "password" : "text"}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          autoComplete="off"
                          placeholder="********"
                          required
                          className="h-9 rounded-xl bg-background pr-10 shadow-sm"
                        />
                      </div>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </div>

            <form.Field name="role">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <div className="flex items-center">
                      <FieldLabel
                        htmlFor="role"
                        className="text-[13px] font-medium"
                      >
                        User Role
                      </FieldLabel>
                    </div>
                    <RadioGroup
                      value={field.state.value}
                      onValueChange={field.handleChange}
                      className="flex w-full gap-2 rounded-xl border bg-background px-3 py-2.5 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="CUSTOMER" id="customer" />
                        <Label htmlFor="customer">Customer</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="TECHNICIAN" id="technician" />
                        <Label htmlFor="technician">Technician</Label>
                      </div>
                    </RadioGroup>

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
            disabled={isPending ? true : false}
            type="submit"
            size="lg"
            className="w-full rounded-xl bg-primary text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            {isPending ? (
              <>
                <Spinner /> Creating
              </>
            ) : (
              "Create Account"
            )}
          </Button>
          {/* <FieldSeparator>Or continue with</FieldSeparator>
          <div className="grid w-full grid-cols-2 gap-2">
            <GoogleAuth disabled={isPending} />
            <FacebookAuth disabled={isPending} />
          </div> */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-foreground underline underline-offset-4"
            >
              Sign in
            </Link>{" "} <br />
            Apply as a manager?{" "}
            <Link
              href="/manager-apply"
              className="font-semibold text-foreground underline underline-offset-4"
            >
              Apply here
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
              <MailCheckIcon className="size-3.5" /> OTP verify
            </span>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
