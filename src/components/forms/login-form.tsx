"use client";

import { useState } from "react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "../ui/field";
import { useForm } from "@tanstack/react-form";
import { Input } from "../ui/input";
import { Eye, EyeClosed } from "lucide-react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import Link from "next/link";
import { useLogin } from "@/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import GoogleAuth from "../auth/google-auth";
import FacebookAuth from "../auth/facebook-auth";
import { loginZodSchema } from "@/validation";
import { Card, CardContent } from "../ui/card";

const LoginForm = () => {
  const [showPass, setShowPass] = useState(false);
  const { mutate, isPending } = useLogin();
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginZodSchema,
    },
    onSubmit: ({ value }) => {
      const loginData = {
        email: value.email.trim(),
        password: value.password,
      };
      mutate(loginData, {
        onSuccess: (res: unknown) => {
          const message =
            typeof res === "object" && res !== null && "message" in res
              ? String((res as { message: unknown }).message)
              : "Logged in successfully";
          toast.success(message);
          form.reset();
          router.push("/");
          router.refresh();
        },
        onError: (err: Error) => {
          toast.error(err.message || "Login failed");
        },
      });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          {/* <p className="text-sm text-balance text-muted-foreground">
                Enter your email below to login to your account
              </p> */}
        </div>
        <form.Field name="email">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            const firstError = field.state.meta.errors?.[0] as unknown;
            const errorMessage =
              typeof firstError === "string"
                ? firstError
                : (firstError as { message?: string } | undefined)?.message;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete="email"
                  placeholder="example@gmail.com"
                  required
                />
                {isInvalid && errorMessage && (
                  <FieldError>{errorMessage}</FieldError>
                )}
              </Field>
            );
          }}
        </form.Field>
        <form.Field name="password">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            const firstError = field.state.meta.errors?.[0] as unknown;
            const errorMessage =
              typeof firstError === "string"
                ? firstError
                : (firstError as { message?: string } | undefined)?.message;
            return (
              <Field data-invalid={isInvalid}>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <div>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      aria-label={showPass ? "Hide password" : "Show password"}
                      className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {!showPass ? (
                        <EyeClosed className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                    <Input
                      id="password"
                      type={!showPass ? "password" : "text"}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      className="pr-10"
                      required
                    />
                  </div>
                  {isInvalid && errorMessage && (
                    <FieldError>{errorMessage}</FieldError>
                  )}
                </div>
              </Field>
            );
          }}
        </form.Field>
        <Field>
          <Button disabled={isPending} type="submit" className="w-full">
            {isPending ? (
              <>
                <Spinner /> Login
              </>
            ) : (
              "Login"
            )}
          </Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>

        <div className="grid grid-cols-2 gap-2">
          <GoogleAuth disabled={isPending} />
          <FacebookAuth disabled={isPending} />
        </div>

        <Field>
          <FieldDescription className="">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="underline font-semibold underline-offset-4"
            >
              Sign up
            </Link>{" "}
            Apply as a manager?{" "}
            <Link
              href="/manager-apply"
              className="underline font-semibold underline-offset-4"
            >
              Apply here
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
};

export default LoginForm;
