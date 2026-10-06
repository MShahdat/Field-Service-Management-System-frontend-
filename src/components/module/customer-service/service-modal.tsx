"use client";

import { useId, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Edit, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import {
  useCreateService,
  useGetAllCategories,
  useGetCategories,
  useGetRegions,
  useSkillCreate,
  useUpdateService,
  useUpdateSkill,
} from "@/hooks";
import { MAX_DESCRIPTION, serviceZodSchema, skillSchema } from "@/validation";
import { ICategory, IRegion, Priority, ServiceRequest } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface ISelectOption {
  value: string;
  label: string;
}

type Props = {
  service?: ServiceRequest;
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
      description: service?.description ?? "",
      servicingDate: service?.servicingDate ?? "",
      preferredStartTime: service?.preferredStartTime ?? "",
      street: service?.address.street ?? "",
      city: service?.address.city ?? "",
      postalCode: service?.address.postalCode ?? "",
      latitude: String(service?.address.coordinates?.latitude ?? ""),
      longitude: String(service?.address.coordinates?.longtude ?? ""),
      categoryId: service?.category?.id ?? "",
      priority: service?.priority as Priority,
      regionId: "",
    },
    validators: {
      onSubmit: serviceZodSchema,
    },
    onSubmit: ({ value }) => {
      const data = {
        description: value.description,
        servicingDate: value.servicingDate,
        preferredStartTime: value.preferredStartTime,
        address: {
          street: value.street,
          city: value.city,
          postalCode: value.postalCode,
          coordinate: {
            latitude: value.latitude,
            longitude: value.longitude,
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
            >
              <Pencil aria-hidden />
              Edit
            </Button>
          ) : (
            <Button>
              <Plus className="size-4" />
              Create Service
            </Button>
          )}
        </DialogTrigger>

        <DialogContent className="max-h-[calc(100dvh-2rem)] min-w-0 overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {isEdit ? "Update Service" : "Create Service"}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Edit the details of this service."
                : "Add a new service if you need."}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <div className="grid grid-cols-2 gap-2">
              <form.Field name="categoryId">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <div className="flex items-center">
                        <FieldLabel htmlFor="categoryId">
                          Category<span className="text-red-500">*</span>
                        </FieldLabel>
                      </div>

                      <Select
                        value={field.state.value}
                        onValueChange={(value) => field.handleChange(value)}
                      >
                        <SelectTrigger onBlur={field.handleBlur}>
                          <SelectValue placeholder="Select a Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryOptions.map((option: ISelectOption) => (
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
              <form.Field name="regionId">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <div className="flex items-center">
                        <FieldLabel htmlFor="regionId">
                          Region<span className="text-red-500">*</span>
                        </FieldLabel>
                      </div>

                      <Select
                        value={field.state.value}
                        onValueChange={(value) => field.handleChange(value)}
                      >
                        <SelectTrigger onBlur={field.handleBlur}>
                          <SelectValue placeholder="Select a Region" />
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
            </div>

            <div className="flex gap-2">
              <form.Field name="priority">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <div className="flex items-center">
                        <FieldLabel htmlFor="priority">
                          Priority<span className="text-red-500">*</span>
                        </FieldLabel>
                      </div>

                      <Select
                        value={field.state.value}
                        onValueChange={(value) =>
                          field.handleChange(value as Priority)
                        }
                      >
                        <SelectTrigger onBlur={field.handleBlur}>
                          <SelectValue placeholder="Select a Priority" />
                        </SelectTrigger>
                        <SelectContent>
                          {priorityOptions.map((option: ISelectOption) => (
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
              <form.Field name="servicingDate">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  const seleted = field.state.value
                    ? new Date(field.state.value)
                    : undefined;

                  // console.log(seleted?.toDateString())
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="date">Date & Time</FieldLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            disabled={mode === "edit"}
                            variant="outline"
                            className="w-fit"
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

            <div className="grid grid-cols-2 gap-2">
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
                        className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
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
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </div>

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
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </div>

            <div className="grid grid-cols-1 gap-2">
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
                    />
                    <div className="flex items-start justify-between gap-2">
                      {isInvalid ? (
                        <FieldError errors={field.state.meta.errors} />
                      ) : (
                        <span />
                      )}
                      <span className="text-xs text-muted-foreground">
                        {field.state.value.length}/{MAX_DESCRIPTION}
                      </span>
                    </div>
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>

          <DialogFooter className="flex items-center justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button type="submit" form={formId}>
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
