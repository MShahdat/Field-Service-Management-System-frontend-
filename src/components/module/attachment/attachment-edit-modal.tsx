"use client";

import { useForm } from "@tanstack/react-form";
import { Edit } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateAttatchment } from "@/hooks";
import type { FileAttachmentType, IAttachment } from "@/types";
import {
  MAX_ATTACHMENT_DESCRIPTION,
  updateAttachmentZodSchema,
} from "@/validation";

type Props = {
  attachment: IAttachment;
};

const TYPE_OPTIONS: { value: FileAttachmentType; label: string }[] = [
  { value: "BEFORE_PHOTO", label: "Before photo" },
  { value: "AFTER_PHOTO", label: "After photo" },
  { value: "SIGNATURE", label: "Signature" },
  { value: "DOCUMENT", label: "Document" },
];

export function AttachmentEditModal({ attachment }: Props) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useUpdateAttatchment();

  const form = useForm({
    defaultValues: {
      type: attachment.type as FileAttachmentType,
      description: attachment.description ?? "",
    },
    validators: {
      onChange: updateAttachmentZodSchema,
    },
    onSubmit: ({ value }) => {
      mutate(
        {
          payload: {
            ...(value.type ? { type: value.type } : {}),
            description: value.description.trim(),
          },
          id: attachment.id,
        },
        {
          onSuccess: (res: { message: string }) => {
            toast.success(res.message ?? "Attachment updated");
            setOpen(false);
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
      form.reset({
        type: attachment.type,
        description: attachment.description ?? "",
      });
    }
    if (!isPending) setOpen(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" aria-label="Edit attachment">
          <Edit className="size-4" aria-hidden />
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[calc(100dvh-2rem)] min-w-0 overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Update Attachment</DialogTitle>
          <DialogDescription>
            Only type and description can be changed. Files cannot be replaced
            (upload a new attachment instead).
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
                    <FieldLabel>Type</FieldLabel>
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

            <form.Field name="description">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>Description</FieldLabel>
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
                      <Spinner /> Updating
                    </>
                  ) : (
                    "Update"
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
