"use client";

import { cn } from "cn";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";

import { Spinner } from "../ui/spinner";

import { useGetRegions, useManagerApply } from "@/hooks";

import { IRegion } from "@/types";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { managerApplyZodSchema } from "@/validation";

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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Apply As a Manager</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Fill in the form below to apply as a manager
          </p>
        </div>
        <form.Field name="name">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor="name">
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
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
                <FieldLabel htmlFor="email">
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
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
                    <FieldLabel htmlFor="phone">
                      Phone<span className="text-red-500">*</span>
                    </FieldLabel>
                  </div>
                  <div>
                    <Input
                      id={field.name}
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="off"
                      required
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </div>
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
                    <FieldLabel htmlFor="nid">
                      NID<span className="text-red-500">*</span>
                    </FieldLabel>
                  </div>
                  <div>
                    <Input
                      id={field.name}
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="off"
                      required
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </div>
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
                  <FieldLabel htmlFor="region">Regions</FieldLabel>
                </div>

                {/* Added value and onValueChange bindings */}
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value)}
                >
                  <SelectTrigger onBlur={field.handleBlur}>
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

                {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
                <FieldLabel htmlFor="street">
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
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
                  <FieldLabel htmlFor="city">
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
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
                  <FieldLabel htmlFor="postalCode">
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
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </div>

        <Field>
          <Button disabled={isPending ? true : false} type="submit">
            {isPending ? (
              <>
                <Spinner /> Creating
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </Field>

        <Field>
          <FieldDescription className="text-center">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold">
              Sign in
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
