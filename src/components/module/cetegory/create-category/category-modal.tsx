"use client";

import { useForm } from "@tanstack/react-form";
import { Edit, Plus, Shapes } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

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
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useCategoryCreate, useUpdateCategory } from "@/hooks";
import type { ICategory } from "@/types";
import { categorySchema, MAX_DESCRIPTION } from "@/validation";

type Props = {
  category?: ICategory;
  mode?: "edit" | "create";
};

export function CategoryModal({ category, mode = "create" }: Props) {
  const isEdit = mode === "edit" && !!category;
  const [open, setOpen] = useState(false);

  const { mutate: createCategory, isPending: createPending } =
    useCategoryCreate();
  const { mutate: updateCategory, isPending: updatePending } =
    useUpdateCategory();

  const isPending = isEdit ? updatePending : createPending;

  const getDefaults = () => ({
    name: category?.name ?? "",
    description: category?.description ?? "",
    duration: category?.duration ?? 0,
    icon: category?.icon ?? "",
  });

  const form = useForm({
    defaultValues: getDefaults(),
    validators: {
      onChange: categorySchema,
    },
    onSubmit: ({ value }) => {
      const data = {
        name: value.name.trim(),
        description: value.description.trim(),
        duration: value.duration,
        icon: value.icon.trim(),
      };

      const callbacks = {
        onSuccess: (res: { message: string }) => {
          toast.success(res.message);
          setOpen(false);
        },
        onError: (err: Error) => {
          toast.error(err.message);
        },
      };

      if (isEdit) {
        updateCategory({ payload: data, id: category.id }, callbacks);
      } else {
        createCategory(data, callbacks);
      }
    },
  });

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) form.reset(getDefaults());
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button size="sm" variant="outline" aria-label="Edit category">
            <Edit className="size-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="size-4" />
            Create Category
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="flex max-h-[calc(100dvh-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl border-border p-0 sm:max-w-xl">
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
              <Shapes className="size-5" />
            </span>
            <div className="min-w-0">
              <DialogTitle className="text-base font-bold tracking-tight text-white sm:text-lg">
                {isEdit ? "Update Category" : "Create Category"}
              </DialogTitle>
              <DialogDescription className="mt-1 text-[13px] leading-relaxed text-white/80">
                {isEdit
                  ? "Edit the details of this service category."
                  : "Add a new service category to your marketplace."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
            <FieldGroup className="gap-4">
              <form.Field name="name">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Category Name<span className="text-primary">*</span>
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        autoComplete="off"
                        placeholder="e.g. Plumbing"
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
                <form.Field name="duration">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Duration (Minute)
                          <span className="text-primary">*</span>
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="number"
                          min={1}
                          inputMode="numeric"
                          value={field.state.value || ""}
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            field.handleChange(
                              e.target.value === ""
                                ? 0
                                : Number(e.target.value),
                            )
                          }
                          aria-invalid={isInvalid}
                          autoComplete="off"
                          placeholder="8"
                          className="rounded-xl bg-background"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field name="icon">
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Category Icon
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        autoComplete="off"
                        placeholder="e.g. wrench"
                        className="rounded-xl bg-background"
                      />
                    </Field>
                  )}
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
                        placeholder="Briefly describe this category..."
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

          <DialogFooter className="mx-0 mb-0 shrink-0 flex-col-reverse gap-2 rounded-b-2xl border-t border-border bg-muted/50 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-end sm:px-6">
            <DialogClose asChild>
              <Button
                size={"sm"}
                type="button"
                variant="outline"
                disabled={isPending}
                className="w-full rounded-xl font-semibold sm:w-auto"
              >
                Cancel
              </Button>
            </DialogClose>

            <form.Subscribe selector={(s) => s.canSubmit}>
              {(canSubmit) => (
                <Button
                  size={"sm"}
                  type="submit"
                  disabled={isPending || !canSubmit}
                  className="w-full gap-2 rounded-xl px-5 font-bold shadow-sm sm:w-auto"
                >
                  {isPending ? (
                    <>
                      <Spinner /> {isEdit ? "Updating" : "Creating"}
                    </>
                  ) : isEdit ? (
                    "Update Category"
                  ) : (
                    "Create Category"
                  )}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
