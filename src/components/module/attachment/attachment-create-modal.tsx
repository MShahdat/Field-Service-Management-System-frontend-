"use client";

import { useForm } from "@tanstack/react-form";
import { Plus } from "lucide-react";
import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useCreateAttatchement } from "@/hooks";
import type { FileAttachmentType } from "@/types";
import {
  ATTACHMENT_ACCEPT,
  ATTACHMENT_MIME_TYPES,
  createAttachmentZodSchema,
  MAX_ATTACHMENT_COUNT,
  MAX_ATTACHMENT_DESCRIPTION,
  MAX_ATTACHMENT_MB,
} from "@/validation";

type Props = {
  workOrderId: string;
};

const TYPE_OPTIONS: { value: FileAttachmentType; label: string }[] = [
  { value: "BEFORE_PHOTO", label: "Before photo" },
  { value: "AFTER_PHOTO", label: "After photo" },
  { value: "SIGNATURE", label: "Signature" },
  { value: "DOCUMENT", label: "Document" },
];

export function AttachmentCreateModal({ workOrderId }: Props) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreateAttatchement();

  const form = useForm({
    defaultValues: {
      type: "" as FileAttachmentType | "",
      description: "",
      files: [] as File[],
    },
    validators: {
      onChange: createAttachmentZodSchema,
    },
    onSubmit: ({ value }) => {
      if (!value.type) {
        toast.error("Attachment type is required");
        return;
      }
      if (value.files.length === 0) {
        toast.error("At least one file is required");
        return;
      }
      mutate(
        {
          data: {
            workOrderId,
            type: value.type as FileAttachmentType,
            description: value.description.trim() || undefined,
          },
          attatchment: value.files,
        },
        {
          onSuccess: (res: { message: string }) => {
            toast.success(res.message ?? "Attachment uploaded");
            setOpen(false);
            form.reset();
          },
          onError: (err: Error) => {
            toast.error(err.message);
          },
        },
      );
    },
  });

  const handleOpenChange = (next: boolean) => {
    if (next) {
      form.reset({ type: "", description: "", files: [] });
    }
    if (!isPending) setOpen(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" type="button">
          <Plus className="size-4" aria-hidden />
          Add Files
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[calc(100dvh-2rem)] min-w-0 overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add Attachment</DialogTitle>
          <DialogDescription>
            Upload up to {MAX_ATTACHMENT_COUNT} files for this work order.
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
            <form.Field name="type">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>
                      Type <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={(v) =>
                        field.handleChange(v as FileAttachmentType)
                      }
                    >
                      <SelectTrigger onBlur={field.handleBlur}>
                        <SelectValue placeholder="Select attachment type" />
                      </SelectTrigger>
                      <SelectContent>
                        {TYPE_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
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

            <form.Field name="files">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>
                      Files <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      type="file"
                      multiple
                      accept={ATTACHMENT_ACCEPT}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        const picked = Array.from(e.target.files ?? []);
                        if (picked.length > MAX_ATTACHMENT_COUNT) {
                          toast.error(
                            `At most ${MAX_ATTACHMENT_COUNT} files allowed`,
                          );
                          return;
                        }
                        const bad = picked.find(
                          (f) =>
                            !ATTACHMENT_MIME_TYPES.includes(f.type) ||
                            f.size > MAX_ATTACHMENT_MB * 1024 * 1024,
                        );
                        if (bad) {
                          toast.error(
                            `Invalid file: ${bad.name}. Only images/pdf/doc under ${MAX_ATTACHMENT_MB}MB`,
                          );
                        }
                        field.handleChange(picked);
                      }}
                    />
                    <p className="text-xs text-muted-foreground">
                      {field.state.value.length > 0
                        ? `${field.state.value.length} file(s) selected`
                        : `Images or .pdf/.doc/.docx, max ${MAX_ATTACHMENT_COUNT} files, ${MAX_ATTACHMENT_MB}MB each.`}
                    </p>
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
                    <FieldLabel>Description (optional)</FieldLabel>
                    <Textarea
                      rows={3}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="off"
                      placeholder="Short note about these files..."
                    />
                    <div className="flex items-start justify-between gap-2">
                      {isInvalid ? (
                        <FieldError errors={field.state.meta.errors} />
                      ) : (
                        <span />
                      )}
                      <span className="text-xs text-muted-foreground">
                        {field.state.value.length}/{MAX_ATTACHMENT_DESCRIPTION}
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
                size="sm"
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
                  size="sm"
                  type="submit"
                  disabled={isPending || !canSubmit}
                >
                  {isPending ? (
                    <>
                      <Spinner /> Uploading
                    </>
                  ) : (
                    "Upload"
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
