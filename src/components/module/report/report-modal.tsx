"use client";

import { useForm } from "@tanstack/react-form";
import { Edit, Plus } from "lucide-react";
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
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useCreateReport, useUpdateReport } from "@/hooks";
import type { IServiceReport } from "@/types";
import {
  MAX_REPORT_DESCRIPTION,
  MAX_REPORT_MB,
  REPORT_ACCEPT,
  REPORT_MIME_TYPES,
  reportZodSchema,
  updateReportZodSchema,
} from "@/validation";

type Props = {
  workOrderId: string;
  report?: IServiceReport | null;
  mode?: "create" | "edit";
};

const validateFile = (file: File | null | undefined): string | null => {
  if (!file) return null;
  const ext = file.name.split(".").pop()?.toLowerCase();
  const validExt = ext === "pdf" || ext === "doc" || ext === "docx";
  if (!validExt || !REPORT_MIME_TYPES.includes(file.type)) {
    return "Only .pdf, .doc, .docx files are allowed";
  }
  if (file.size > MAX_REPORT_MB * 1024 * 1024) {
    return `File must be under ${MAX_REPORT_MB}MB`;
  }
  return null;
};

export function ReportModal({ workOrderId, report, mode = "create" }: Props) {
  const isEdit = mode === "edit" && !!report;
  const [open, setOpen] = useState(false);

  const { mutate: createReport, isPending: createPending } = useCreateReport();
  const { mutate: updateReport, isPending: updatePending } = useUpdateReport();

  const isPending = isEdit ? updatePending : createPending;

  const form = useForm({
    defaultValues: {
      description: report?.description ?? "",
      file: null as File | null,
    },
    validators: {
      onChange: isEdit ? updateReportZodSchema : reportZodSchema,
    },
    onSubmit: ({ value }) => {
      const description = value.description.trim();

      if (isEdit && report) {
        if (value.file) {
          const err = validateFile(value.file);
          if (err) {
            toast.error(err);
            return;
          }
        }
        updateReport(
          {
            payload: {
              description,
              ...(value.file ? { file: value.file } : {}),
            },
            id: report.id,
          },
          {
            onSuccess: (res: { message: string }) => {
              toast.success(res.message ?? "Report updated");
              setOpen(false);
            },
            onError: (err: Error) => {
              toast.error(err.message);
            },
          },
        );
      } else {
        if (!value.file) {
          toast.error("Report file is required (.pdf, .doc, .docx)");
          return;
        }
        const err = validateFile(value.file);
        if (err) {
          toast.error(err);
          return;
        }
        createReport(
          { workOrderId, description, file: value.file },
          {
            onSuccess: (res: { message: string }) => {
              toast.success(res.message ?? "Report uploaded");
              setOpen(false);
            },
            onError: (err: Error) => {
              toast.error(err.message);
            },
          },
        );
      }
    },
  });

  const handleOpenChange = (next: boolean) => {
    if (next) {
      form.reset({
        description: report?.description ?? "",
        file: null,
      });
    }
    if (!isPending) setOpen(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button size="sm" variant="outline" aria-label="Update report">
            <Edit className="size-4" aria-hidden />
            Update
          </Button>
        ) : (
          <Button size="sm" type="button">
            <Plus className="size-4" aria-hidden />
            Upload Report
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-h-[calc(100dvh-2rem)] min-w-0 overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Update Service Report" : "Upload Service Report"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Replace the report file (.pdf, .doc, .docx) or update the description."
              : "Upload the completion report as .pdf, .doc or .docx (max 10MB)."}
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
            <form.Field name="file">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Report file{" "}
                      {!isEdit && <span className="text-destructive">*</span>}
                    </FieldLabel>
                    <Input
                      id={field.name}
                      type="file"
                      accept={REPORT_ACCEPT}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        if (file) {
                          const err = validateFile(file);
                          if (err) toast.error(err);
                        }
                        field.handleChange(file);
                      }}
                    />
                    <p className="text-xs text-muted-foreground">
                      {field.state.value
                        ? `Selected: ${field.state.value.name} (${(
                            field.state.value.size / 1024 / 1024
                          ).toFixed(2)}MB)`
                        : isEdit && report?.reportUrl
                          ? "No new file chosen — existing report will be kept."
                          : "Only .pdf, .doc, .docx allowed."}
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
                    <FieldLabel htmlFor={field.name}>
                      Description (optional)
                    </FieldLabel>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      rows={3}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="off"
                      placeholder="Short summary of work done..."
                    />
                    <div className="flex items-start justify-between gap-2">
                      {isInvalid ? (
                        <FieldError errors={field.state.meta.errors} />
                      ) : (
                        <span />
                      )}
                      <span className="text-xs text-muted-foreground">
                        {field.state.value.length}/{MAX_REPORT_DESCRIPTION}
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
                      <Spinner /> {isEdit ? "Updating" : "Uploading"}
                    </>
                  ) : isEdit ? (
                    "Update Report"
                  ) : (
                    "Upload Report"
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
