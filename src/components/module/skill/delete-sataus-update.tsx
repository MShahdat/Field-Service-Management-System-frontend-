"use client";

import { useState } from "react";
import {
  ArchiveRestore,
  TriangleAlert,
  CircleCheck,
  Archive,
} from "lucide-react";
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
import { cn } from "@/lib/utils";
import { useSkillDeleteUpdate } from "@/hooks";

type Props = {
  id: string;
  name?: string;
  isDeleted: boolean; // true = already deleted, false = not deleted
};

export function DeleteStatusModal({ id, name, isDeleted }: Props) {
  const [open, setOpen] = useState(false);
  const { mutate: toggleStatus, isPending } = useSkillDeleteUpdate();

  const isDanger = !isDeleted;

  const config = isDanger
    ? {
        triggerIcon: Archive,
        dialogIcon: TriangleAlert,
        triggerLabel: "Delete",
        title: name ? `Delete “${name}”?` : "Delete skill?",
        description:
          "This skill will no longer be available for new selections. Existing records linked to it will not be affected. You can restore it at any time.",
        confirmLabel: "Delete",
        pendingLabel: "Deleting",
        confirmVariant: "destructive" as const,
      }
    : {
        triggerIcon: ArchiveRestore,
        dialogIcon: CircleCheck,
        triggerLabel: "Restore",
        title: name ? `Restore “${name}”?` : "Restore skill?",
        description:
          "This skill will become available for new selections again. Existing records linked to it will not be affected. You can delete it again at any time.",
        confirmLabel: "Restore",
        pendingLabel: "Restoring",
        confirmVariant: "default" as const,
      };

  const TriggerIcon = config.triggerIcon;
  const DialogIcon = config.dialogIcon;

  const handleConfirm = () => {
    toggleStatus(id, {
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
          size="sm"
          variant="outline"
          aria-label={
            name
              ? `${config.triggerLabel} ${name}`
              : `${config.triggerLabel} skill`
          }
          title={config.triggerLabel}
          className={cn(
            isDanger
              ? "border-red-500/40 text-red-600 hover:bg-red-500/10 hover:text-red-600"
              : "border-green-500/40 text-green-600 hover:bg-green-500/10 hover:text-green-600",
          )}
        >
          <TriggerIcon className="size-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-full",
                isDanger ? "bg-red-500/10" : "bg-green-500/10",
              )}
            >
              <DialogIcon
                className={cn(
                  "size-5",
                  isDanger ? "text-red-600" : "text-green-600",
                )}
              />
            </div>
            <div className="space-y-1.5">
              <DialogTitle>{config.title}</DialogTitle>
              <DialogDescription>{config.description}</DialogDescription>
            </div>
          </div>
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
            variant={config.confirmVariant}
            className={cn(
              !isDanger && "bg-green-600 text-white hover:bg-green-700",
            )}
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Spinner /> {config.pendingLabel}
              </>
            ) : (
              config.confirmLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
