"use client";

import { useForm } from "@tanstack/react-form";
import { format } from "date-fns";
import { Pencil, Plus, Wrench } from "lucide-react";
import { useId, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateService,
  useGetAllCategories,
  useGetCategories,
  useGetRegions,
  useSkillCreate,
  useUpdateService,
  useUpdateSkill,
} from "@/hooks";
import type {
  ICategory,
  IRegion,
  IService,
  Priority,
  ServiceRequest,
} from "@/types";
import { MAX_DESCRIPTION, serviceZodSchema, skillSchema } from "@/validation";

interface ISelectOption {
  value: string;
  label: string;
}

type Props = {
  service?: ServiceRequest | IService;
  mode?: "edit" | "create";
};

export function MyServiceModal({ service, mode = "create" }: Props) {
  const isEdit = mode === "edit" && !!service;
  const [open, setOpen] = useState(false);
  const formId = useId();

  const { data: getCategories, isPending: categoryPending } =
    useGetCategories();
  const { data: getRegions, isPending: regionPending } = useGetRegions();
  const { mutate: createService, isPending: createPending } =
    useCreateService();
  const { mutate: updateService, isPending: updatePending } =
    useUpdateService();

  // console.log("category ", data);

  // if (categoryPending || regionPending) {
  //   return;
  // }

  // if (!getCategories?.success || !getRegions?.success) {
  //   return (
  //     <DataNotFoundCard message="Category not available or Regions not available" />
  //   );
  // }

  const categories = getCategories?.data ?? [];
  const regions = getRegions?.data ?? [];

  const categoryOptions: ISelectOption[] = categories
    ? categories.map((category: ICategory) => ({
      value: category.id,
      label: category.name,
    }))
    : [];

  const regionOptions: ISelectOption[] = regions
    ? regions
      .filter((region: IRegion) => region.area !== "All")
      .map((region: IRegion) => ({
        value: region.id,
        label: region.area,
      }))
    : [];

  const priorityOptions: { label: string; value: Priority }[] = [
    { label: "Low", value: "LOW" },
    { label: "Medium", value: "MEDIUM" },
    { label: "High", value: "HIGH" },
    { label: "Urgent", value: "URGENT" },
  ];

  const form = useForm({
    defaultValues: {
      title: service?.title ?? "",
      description: service?.description ?? "",
      servicingDate: service?.servicingDate ?? "",
      preferredStartTime: service?.preferredStartTime ?? "",
      street: service?.address.street ?? "",
      city: service?.address.city ?? "",
      postalCode: service?.address.postalCode ?? "",
      latitude: String(service?.address.coordinates?.latitude ?? ""),
      longitude: String(service?.address.coordinates?.longitude ?? ""),
      categoryId: service?.category?.id ?? "",
      priority: service?.priority as Priority,
      regionId: service?.region?.id ?? "",
    },
    validators: {
      onSubmit: serviceZodSchema,
    },
    onSubmit: ({ value }) => {
      const data = {
        title: value.title,
        description: value.description,
        servicingDate: value.servicingDate,
        preferredStartTime: value.preferredStartTime,
        address: {
          street: value.street,
          city: value.city,
          postalCode: value.postalCode,
          coordinates: {
            latitude: Number(value.latitude),
            longitude: Number(value.longitude),
          },
        },
        categoryId: value.categoryId,
        priority: value.priority,
        regionId: value.regionId,
      };
      console.log("date", data);

      if (mode === "edit" && service) {
        updateService(
          { payload: data, id: service.id },
          {
            onSuccess: (res) => {
              toast.success(res.success);
              setOpen(false);
            },
            onError: (err) => {
              toast.error(err.message);
            },
          },
        );
      } else {
        createService(data, {
          onSuccess: (res) => {
            toast.success(res.message);
            setOpen(false);
            form.reset();
          },
          onError: (err) => {
            toast.error(err.message);
          },
        });
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form
        id={formId}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <DialogTrigger asChild>
          {isEdit ? (
            <Button
              type="button"
              size="sm"
              variant="accepted"
              disabled={service.status !== "PENDING"}
              className="gap-1.5 rounded-xl font-semibold shadow-sm"
            >
              <Pencil aria-hidden />
              Edit
            </Button>
          ) : (
            <Button className="gap-1.5 rounded-xl font-semibold shadow-sm">
              <Plus className="size-4" />
              Create Service
            </Button>
          )}
        </DialogTrigger>

        <DialogContent className="flex max-h-[calc(100dvh-1.5rem)] min-w-0 flex-col gap-0 overflow-hidden rounded-2xl border-border p-0 sm:max-w-xl">
          <DialogHeader className="relative shrink-0 gap-1 overflow-hidden bg-primary px-5 pt-5 pb-5 sm:px-6">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 overflow-hidden"
            >
              <div className="absolute -top-12 -right-12 size-44 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -bottom-16 left-24 size-40 rounded-full bg-black/10 blur-2xl" />
            </div>
            <div className="relative flex items-start gap-3 pr-8">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-white/25 backdrop-blur">
                <Wrench className="size-5" />
              </span>
              <div className="min-w-0">
                <DialogTitle className="text-base font-bold tracking-tight text-white sm:text-lg">
                  {isEdit ? "Update Service" : "Create Service"}
                </DialogTitle>
                <DialogDescription className="mt-1 text-[13px] leading-relaxed text-white/80">
                  {isEdit
                    ? "Edit the details of this service."
                    : "Add a new service if you need."}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
            <FieldGroup className="gap-4">
              <form.Field name="title">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="title">
                        Title<span className="text-primary">*</span>
                      </FieldLabel>
                      <Input
                        id={field.name}
                        type="text"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        // autoComplete="off"
                        placeholder="Write title"
                        required
                        className="rounded-xl bg-background"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <form.Field name="categoryId">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <div className="flex items-center">
                          <FieldLabel htmlFor="categoryId">
                            Category<span className="text-primary">*</span>
                          </FieldLabel>
                        </div>

                        <Select
                          value={field.state.value}
                          onValueChange={(value) => field.handleChange(value)}
                        >
                          <SelectTrigger
                            onBlur={field.handleBlur}
                            className="rounded-xl bg-background"
                          >
                            <SelectValue placeholder="Select a Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categoryOptions.map((option: ISelectOption) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
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
                <form.Field name="regionId">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <div className="flex items-center">
                          <FieldLabel htmlFor="regionId">
                            Region<span className="text-primary">*</span>
                          </FieldLabel>
                        </div>

                        <Select
                          value={field.state.value}
                          onValueChange={(value) => field.handleChange(value)}
                        >
                          <SelectTrigger
                            onBlur={field.handleBlur}
                            className="rounded-xl bg-background"
                          >
                            <SelectValue placeholder="Select a Region" />
                          </SelectTrigger>
                          <SelectContent>
                            {regionOptions.map((option: ISelectOption) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
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
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <form.Field name="priority">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="flex-1">
                        <div className="flex items-center">
                          <FieldLabel htmlFor="priority">
                            Priority<span className="text-primary">*</span>
                          </FieldLabel>
                        </div>

                        <Select
                          value={field.state.value}
                          onValueChange={(value) =>
                            field.handleChange(value as Priority)
                          }
                        >
                          <SelectTrigger
                            onBlur={field.handleBlur}
                            className="rounded-xl bg-background"
                          >
                            <SelectValue placeholder="Select a Priority" />
                          </SelectTrigger>
                          <SelectContent>
                            {priorityOptions.map((option: ISelectOption) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
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
                <form.Field name="servicingDate">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    const seleted = field.state.value
                      ? new Date(field.state.value)
                      : undefined;

                    // console.log(seleted?.toDateString())
                    return (
                      <Field data-invalid={isInvalid} className="flex-1">
                        <FieldLabel htmlFor="date">Date & Time</FieldLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              disabled={mode === "edit"}
                              variant="outline"
                              className="w-full justify-start rounded-xl font-normal sm:w-fit"
                            >
                              {seleted ? seleted.toDateString() : "Select Date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="center">
                            <Calendar
                              mode="single"
                              selected={seleted}
                              disabled={{ before: new Date() }}
                              onSelect={(e) => {
                                if (e) {
                                  field.handleChange(format(e, "yyyy-MM-dd"));
                                  field.handleBlur();
                                }
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <form.Field name="preferredStartTime">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor="startDateTime">
                          Start Time
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="time"
                          value={field.state.value}
                          onChange={(e) => {
                            field.handleChange(e.target.value);
                          }}
                          onBlur={field.handleBlur}
                          className="appearance-none rounded-xl bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        />
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
                        <FieldLabel htmlFor="street">
                          Street Address<span className="text-primary">*</span>
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
                          className="rounded-xl bg-background"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <form.Field name="city">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="flex-1">
                        <FieldLabel htmlFor="city">
                          City<span className="text-primary">*</span>
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
                          className="rounded-xl bg-background"
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
                      <Field data-invalid={isInvalid} className="flex-1">
                        <FieldLabel htmlFor="postalCode">
                          Postal Code<span className="text-primary">*</span>
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
                          className="rounded-xl bg-background"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <form.Field name="latitude">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor="latitude">Latitude</FieldLabel>
                        <Input
                          id={field.name}
                          type="number"
                          min={0}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          autoComplete="off"
                          placeholder="23.125498"
                          className="rounded-xl bg-background"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
                <form.Field name="longitude">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor="longitude">Longitude</FieldLabel>
                        <Input
                          id={field.name}
                          type="number"
                          min={0}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          autoComplete="off"
                          placeholder="23.215648"
                          className="rounded-xl bg-background"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>
              <form.Field name="description">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        rows={4}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        autoComplete="off"
                        placeholder="Briefly describe this region..."
                        className="resize-none rounded-xl bg-background"
                      />
                      <div className="flex items-start justify-between gap-2">
                        {isInvalid ? (
                          <FieldError errors={field.state.meta.errors} />
                        ) : (
                          <span />
                        )}
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {field.state.value.length}/{MAX_DESCRIPTION}
                        </span>
                      </div>
                    </Field>
                  );
                }}
              </form.Field>
            </FieldGroup>
          </div>

          <DialogFooter className="mx-0 mb-0 flex shrink-0 flex-col-reverse items-stretch gap-2 rounded-b-2xl border-t border-border bg-muted/50 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-end sm:px-6">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="w-full rounded-xl font-semibold sm:w-auto"
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              type="submit"
              form={formId}
              className="w-full gap-2 rounded-xl px-5 font-bold shadow-sm sm:w-auto"
            >
              {mode === "edit" ? (
                updatePending ? (
                  <>
                    <Spinner /> Updating
                  </>
                ) : (
                  "Update"
                )
              ) : createPending ? (
                <>
                  <Spinner /> Creating
                </>
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
