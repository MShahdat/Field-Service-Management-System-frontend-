"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { Edit, Plus } from "lucide-react";
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
import { IRegion } from "@/types";
import { useRegionCreate, useUpdateRegion } from "@/hooks";
import { MAX_DESCRIPTION } from "@/validation";

type Props = {
  region?: IRegion;
  mode?: "edit" | "create";
};

export function RegionModal({ region, mode = "create" }: Props) {
  const isEdit = mode === "edit" && !!region;
  const [open, setOpen] = useState(false);

  const { mutate: createRegion, isPending: createPending } = useRegionCreate();
  const { mutate: updateRegion, isPending: updatePending } = useUpdateRegion();

  const isPending = isEdit ? updatePending : createPending;

  const getDefaults = () => ({
    area: region?.area ?? "",
    description: region?.description ?? "",
  });

  const form = useForm({
    defaultValues: getDefaults(),
    validators: {},
    onSubmit: ({ value }) => {
      const data = {
        area: value.area.trim(),
        description: value.description.trim(),
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
        updateRegion(
          { payload: { ...data, id: region.id }, id: region.id },
          callbacks,
        );
      } else {
        createRegion(data, callbacks);
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
          <Button size="sm" variant="outline" aria-label="Edit region">
            <Edit className="size-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="size-4" />
            Create Region
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-h-[calc(100dvh-2rem)] min-w-0 overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Update Region" : "Create Region"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Edit the details of this region."
              : "Add a new region to your marketplace."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          <FieldGroup>
            <form.Field name="area">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Area<span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="off"
                      placeholder="e.g. Dhaka North"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

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

          <DialogFooter className="flex-row justify-end gap-2 sm:justify-end sm:gap-2">
            <DialogClose asChild>
              <Button
                size={"sm"}
                type="button"
                variant="outline"
                disabled={isPending}
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
                >
                  {isPending ? (
                    <>
                      <Spinner /> {isEdit ? "Updating" : "Creating"}
                    </>
                  ) : isEdit ? (
                    "Update Region"
                  ) : (
                    "Create Region"
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
