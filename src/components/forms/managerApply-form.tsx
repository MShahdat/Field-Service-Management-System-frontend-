"use client";

import { useForm } from "@tanstack/react-form";
import {
  BriefcaseBusinessIcon,
  ClipboardCheckIcon,
  LockIcon,
  ShieldCheckIcon,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
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
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useGetRegions, useManagerApply } from "@/hooks";
import type { IRegion } from "@/types";
import { managerApplyZodSchema } from "@/validation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Spinner } from "../ui/spinner";

export interface ISelectOption {
  value: string;
  label: string;
}

export function ManagerApplyForm() {
  const { mutate, isPending } = useManagerApply();

  const { data } = useGetRegions();
  console.log("regions ", data);

  const regionOptions: ISelectOption[] = data?.data
    ? data.data
      .filter((region: IRegion) => region.area !== "All")
      .map((region: IRegion) => ({
        value: region.id,
        label: region.area,
      }))
    : [];

  console.log("select options", regionOptions);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      nid: "",
      region: "",
      street: "",
      city: "",
      postalCode: "",
    },
    validators: {
      onSubmit: managerApplyZodSchema,
    },
    onSubmit: ({ value }) => {
      console.log(value);
      const data = {
        user: {
          name: value.name,
          email: value.email,
        },
        manager: {
          phone: value.phone,
          nid: value.nid,
          region: [value.region],
          address: {
            street: value.street,
            city: value.city,
            postalCode: value.postalCode,
          },
        },
      };

      console.log("data", data);

      mutate(data, {
        onSuccess: (res) => {
          toast.success(res.message);
          localStorage.setItem(
            `otp-expiry-manager-${value.email}`,
            (Date.now() + 60 * 60 * 1000).toString(),
          );
          const params = new URLSearchParams({ email: value.email });
          redirect(`/register/email-verify?${params.toString()}&role=manager`);
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
          Apply As a Manager
        </CardTitle>
        <CardDescription className="mx-auto max-w-xs text-balance text-[13px] leading-relaxed">
          Fill in the form below to apply as a manager
        </CardDescription>
      </CardHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <CardContent className="px-4 sm:px-8">
          <FieldGroup className="-space-y-2">
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

            <div className="flex gap-2">
              <form.Field name="phone">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <div className="flex items-center">
                        <FieldLabel
                          htmlFor="phone"
                          className="text-[13px] font-medium"
                        >
                          Phone<span className="text-red-500">*</span>
                        </FieldLabel>
                      </div>
                      <Input
                        id={field.name}
                        type="text"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        autoComplete="off"
                        placeholder="+880 1XXX-XXXXXX"
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

              <form.Field name="nid">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <div className="flex items-center">
                        <FieldLabel
                          htmlFor="nid"
                          className="text-[13px] font-medium"
                        >
                          NID<span className="text-red-500">*</span>
                        </FieldLabel>
                      </div>
                      <Input
                        id={field.name}
                        type="text"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        autoComplete="off"
                        placeholder="10-digit NID"
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
            </div>

            <form.Field name="region">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <div className="flex items-center">
                      <FieldLabel
                        htmlFor="region"
                        className="text-[13px] font-medium"
                      >
                        Regions
                      </FieldLabel>
                    </div>

                    {/* Added value and onValueChange bindings */}
                    <Select
                      value={field.state.value}
                      onValueChange={(value) => field.handleChange(value)}
                    >
                      <SelectTrigger
                        onBlur={field.handleBlur}
                        className="h-11 rounded-xl bg-background shadow-sm"
                      >
                        <SelectValue placeholder="Select a region" />
                      </SelectTrigger>
                      <SelectContent>
                        {regionOptions.map((option: ISelectOption) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="street">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      htmlFor="street"
                      className="text-[13px] font-medium"
                    >
                      Street Address<span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      autoComplete="off"
                      placeholder="12/3 Block Gulshan"
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
              <form.Field name="city">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel
                        htmlFor="city"
                        className="text-[13px] font-medium"
                      >
                        City<span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        id={field.name}
                        type="text"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        autoComplete="off"
                        placeholder="Dhaka"
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
              <form.Field name="postalCode">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel
                        htmlFor="postalCode"
                        className="text-[13px] font-medium"
                      >
                        Postal Code<span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        id={field.name}
                        type="text"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        autoComplete="off"
                        placeholder="1200"
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
            </div>
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

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-foreground underline underline-offset-4"
            >
              Sign in
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
              <ClipboardCheckIcon className="size-3.5" /> Manual review
            </span>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
