"use client";

import { useForm } from "@tanstack/react-form";
import { cn } from "cn";
import { Edit, Plus, Star } from "lucide-react";
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
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useFeedbackCreate, useUpdateFeedback } from "@/hooks";
import type { IFeedback } from "@/types";
import { MAX_FEEDBACK_COMMENT, feedbackZodSchema } from "@/validation";

type Props = {
  workOrderId: string;
  feedback?: IFeedback | null;
  mode?: "create" | "edit";
};

export function FeedbackModal({
  workOrderId,
  feedback,
  mode = "create",
}: Props) {
  const isEdit = mode === "edit" && !!feedback;
  const [open, setOpen] = useState(false);

  const { mutate: createFeedback, isPending: createPending } =
    useFeedbackCreate();
  const { mutate: updateFeedback, isPending: updatePending } =
    useUpdateFeedback();

  const isPending = isEdit ? updatePending : createPending;

  const form = useForm({
    defaultValues: {
      rating: feedback?.rating ?? 0,
      comment: feedback?.comment ?? "",
    },
    validators: {
      onChange: feedbackZodSchema,
    },
    onSubmit: ({ value }) => {
      const rating = Number(value.rating);
      const comment = value.comment.trim();

      if (isEdit && feedback) {
        updateFeedback(
          { payload: { rating, comment }, id: feedback.id },
          {
            onSuccess: (res: { message: string }) => {
              toast.success(res.message ?? "Feedback updated");
              setOpen(false);
            },
            onError: (err: Error) => {
              toast.error(err.message);
            },
          },
        );
      } else {
        createFeedback(
          { workOrderId, rating, comment },
          {
            onSuccess: (res: { message: string }) => {
              toast.success(res.message ?? "Feedback submitted");
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
        rating: feedback?.rating ?? 0,
        comment: feedback?.comment ?? "",
      });
    }
    if (!isPending) setOpen(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button size="sm" variant="outline" aria-label="Edit feedback">
            <Edit className="size-4" aria-hidden />
            Edit
          </Button>
        ) : (
          <Button size="sm" type="button">
            <Plus className="size-4" aria-hidden />
            Give Feedback
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-h-[calc(100dvh-2rem)] min-w-0 overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Update Feedback" : "Give Feedback"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update your rating and comment for this completed service."
              : "Rate the completed service and share your experience."}
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
            <form.Field name="rating">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                const current = Number(field.state.value) || 0;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>Rating</FieldLabel>
                    <div
                      className="flex items-center gap-1"
                      role="radiogroup"
                      aria-label="Rating"
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => field.handleChange(star)}
                          onBlur={field.handleBlur}
                          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                          aria-pressed={current >= star}
                          className="rounded-sm p-0.5 transition-transform hover:scale-110 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                        >
                          <Star
                            className={cn(
                              "size-7",
                              star <= current
                                ? "fill-amber-500 text-amber-500"
                                : "fill-muted text-muted",
                            )}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-muted-foreground">
                        {current > 0 ? `${current}/5` : "Select rating"}
                      </span>
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="comment">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Comment</FieldLabel>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      rows={4}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="off"
                      placeholder="Write your feedback..."
                    />
                    <div className="flex items-start justify-between gap-2">
                      {isInvalid ? (
                        <FieldError errors={field.state.meta.errors} />
                      ) : (
                        <span />
                      )}
                      <span className="text-xs text-muted-foreground">
                        {field.state.value.length}/{MAX_FEEDBACK_COMMENT}
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
                      <Spinner /> {isEdit ? "Updating" : "Submitting"}
                    </>
                  ) : isEdit ? (
                    "Update Feedback"
                  ) : (
                    "Submit Feedback"
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
