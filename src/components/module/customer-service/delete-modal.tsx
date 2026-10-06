"use client";

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
import { useDeleteService } from "@/hooks";
import { ServiceRequest } from "@/types";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  service: ServiceRequest;
};

const DeleteModal = ({ service }: Props) => {
  const [open, setOpen] = useState(false);

  const isDelete =
    service.status === "APPROVED" ||
    service.status === "IN_PROGRESS" ||
    service.status === "ASSIGMED";

  const { mutate, isPending } = useDeleteService();

  const handleConfirm = () => {
    mutate(service.id, {
      onSuccess: (res) => {
        toast.success(res.message);
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
        <Button
          type="button"
          size="sm"
          variant="destructive"
          disabled={isDelete}
        >
          <Trash2 aria-hidden />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg">
            Delete this service request?
          </DialogTitle>
          <DialogDescription>
            This permanently removes the request and its history. You can’t undo
            this action.
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
            variant={"destructive"}
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

export default DeleteModal;
