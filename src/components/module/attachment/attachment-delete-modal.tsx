"use client";

import { Trash2 } from "lucide-react";
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
import { Spinner } from "@/components/ui/spinner";
import { useDeleteAttatchemnt } from "@/hooks";

type Props = {
  attachmentId: string;
};

const AttachmentDeleteModal = ({ attachmentId }: Props) => {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useDeleteAttatchemnt();

  const handleConfirm = () => {
    mutate(
      { id: attachmentId },
      {
        onSuccess: (res: { message: string }) => {
          toast.success(res.message ?? "Attachment deleted");
          setOpen(false);
        },
        onError: (err: Error) => {
          toast.error(err.message);
        },
      },
    );
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
          <DialogTitle className="text-lg">Delete this attachment?</DialogTitle>
          <DialogDescription>
            This removes the attachment files for this order. You can’t undo
            this action, but you can upload new files afterwards.
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

export default AttachmentDeleteModal;
