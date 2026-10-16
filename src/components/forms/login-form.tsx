"use client";

import { useForm } from "@tanstack/react-form";
import {
  Eye,
  EyeClosed,
  LockIcon,
  LogInIcon,
  MousePointerClickIcon,
  ShieldCheckIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useLogin } from "@/hooks";
import { getDashboardUrl } from "@/utils";
import { loginZodSchema } from "@/validation";
import FacebookAuth from "../auth/facebook-auth";
import GoogleAuth from "../auth/google-auth";
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
  FieldSeparator,
} from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";

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
        onSuccess: (res) => {
          toast.success(res.message);
          form.reset();
          const dashboardUrl = getDashboardUrl(res?.data?.user.role);
          if (dashboardUrl) {
            router.push(dashboardUrl);
          } else {
            router.push("/");
          }
          router.refresh();
        },
        onError: (err: Error) => {
          toast.error(err.message || "Login failed");
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
          Login to your account
        </CardTitle>
        <CardDescription className="mx-auto max-w-xs text-balance text-[13px] leading-relaxed">
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <CardContent className="px-6 pt-2 sm:px-8">
          <FieldGroup className="gap-4">
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
                      aria-invalid={isInvalid}
                      autoComplete="email"
                      placeholder="example@gmail.com"
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
                        Password
                      </FieldLabel>
                      <Link
                        href="/forgot-password"
                        className="ml-auto text-sm font-medium underline-offset-4 hover:underline text-foreground"
                      >
                        Forgot your password?
                      </Link>
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
                        id="password"
                        type={!showPass ? "password" : "text"}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        autoComplete="current-password"
                        placeholder="Enter your password"
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
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex-col gap-3 border-0 bg-transparent px-6 pb-5 pt-3 sm:px-8">
          <Button
            disabled={isPending}
            type="submit"
            size="lg"
            className="w-full rounded-xl bg-primary text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            {isPending ? (
              <>
                <Spinner /> Login
              </>
            ) : (
              "Login"
            )}
          </Button>
          <FieldSeparator>Or continue with</FieldSeparator>
          <div className="grid w-full grid-cols-2 gap-2">
            <GoogleAuth disabled={isPending} />
            <FacebookAuth disabled={isPending} />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-foreground underline underline-offset-4"
            >
              Sign up
            </Link>{" "} <br />
            Apply as a manager?{" "}
            <Link
              href="/manager-apply"
              className="font-medium text-foreground underline underline-offset-4"
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
              <MousePointerClickIcon className="size-3.5" /> 1-click demo
            </span>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoginForm;
