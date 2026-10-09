"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
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
import { Spinner } from "@/components/ui/spinner";
import { useDeleteFeedback } from "@/hooks";

type Props = {
  feedbackId: string;
};

const FeedbackDeleteModal = ({ feedbackId }: Props) => {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useDeleteFeedback();

  const handleConfirm = () => {
    mutate(feedbackId, {
      onSuccess: (res: { message: string }) => {
        toast.success(res.message ?? "Feedback deleted");
        setOpen(false);
      },
      onError: (err: Error) => {
        toast.error(err.message);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !isPending && setOpen(next)}>
      <DialogTrigger asChild>
        <Button type="button" size="sm" variant="destructive">
          <Trash2 aria-hidden />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg">Delete this feedback?</DialogTitle>
          <DialogDescription>
            This permanently removes your feedback for this order. You can’t
            undo this action, but you can submit a new one afterwards.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-row justify-end gap-2 sm:justify-end sm:gap-2">
          <DialogClose asChild>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isPending}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Spinner /> Confirm
              </>
            ) : (
              "Confirm"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDeleteModal;
