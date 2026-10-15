"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { useDeleteService } from "@/hooks";
import { cn } from "@/lib/utils";
import type { IService, ServiceRequest } from "@/types";

type Props = {
  service: ServiceRequest | IService;
  redirectOnDelete?: string;
};

const DeleteModal = ({ service, redirectOnDelete }: Props) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const isDelete =
    service.status === "APPROVED" ||
    service.status === "IN_PROGRESS" ||
    service.status === "ASSIGNED";

  const { mutate, isPending } = useDeleteService();

  const handleConfirm = () => {
    mutate(service.id, {
      onSuccess: (res) => {
        toast.success(res.message);
        setOpen(false);
        if (redirectOnDelete) {
          router.push(redirectOnDelete);
        }
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
          className="gap-1.5 rounded-xl font-semibold shadow-sm"
        >
          <Trash2 aria-hidden />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-0 overflow-hidden rounded-2xl border-border p-0 sm:max-w-sm">
        <div
          className={cn("h-1.5 bg-gradient-to-r from-red-500 to-red-500/30")}
        />
        <div className="px-5 pt-5 sm:px-6">
          <DialogHeader>
            <div className="flex items-start gap-3.5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-red-500/10 text-red-600 ring-1 ring-red-500/25 dark:text-red-400">
                <Trash2 className="size-5" aria-hidden />
              </span>
              <div className="min-w-0 space-y-1 pt-0.5">
                <DialogTitle className="text-[15px] font-bold tracking-tight text-foreground">
                  Delete this service request?
                </DialogTitle>
                <DialogDescription className="text-[13px] leading-relaxed">
                  This permanently removes the request and its history. You
                  can’t undo this action.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <DialogFooter className="mx-0 mb-0 mt-5 flex-col-reverse gap-2 rounded-b-2xl border-t border-border bg-muted/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-end">
          <DialogClose asChild>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isPending}
              className="w-full rounded-xl font-semibold sm:w-auto"
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
            className="w-full gap-2 rounded-xl font-semibold shadow-sm sm:w-auto"
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
