"use client";

import { Ban, CircleCheck, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { StatusUpdatePayload } from "@/api";
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
import { useUpdateStatus } from "@/hooks";
import { cn } from "@/lib/utils";
import type { UserStatus } from "@/types";

type Props = {
  id: string;
  name?: string;
  current: UserStatus;
  action: StatusUpdatePayload;
};

export function UserStatusModal({ id, name, current, action }: Props) {
  const [open, setOpen] = useState(false);
  const { mutate: changeStatus, isPending } = useUpdateStatus();

  const config =
    action === "ACTIVE"
      ? {
          triggerIcon: CircleCheck,
          dialogIcon: CircleCheck,
          triggerLabel: "Activate",
          title: name ? `Activate "${name}"?` : "Activate user?",
          description:
            current === "BLOCKED"
              ? "This user will be unblocked and regain access. You can block or delete them again at any time."
              : "This user will be restored to active status and regain access. You can block or delete them again at any time.",
          confirmLabel: "Activate",
          pendingLabel: "Activating",
          confirmVariant: "default" as const,
          active: true,
        }
      : action === "BLOCKED"
        ? {
            triggerIcon: Ban,
            dialogIcon: Ban,
            triggerLabel: "Block",
            title: name ? `Block "${name}"?` : "Block user?",
            description:
              "This user will lose access immediately. Existing records linked to them will not be affected. You can activate them again at any time.",
            confirmLabel: "Block",
            pendingLabel: "Blocking",
            confirmVariant: "destructive" as const,
            active: false,
          }
        : {
            triggerIcon: Trash2,
            dialogIcon: Trash2,
            triggerLabel: "Delete",
            title: name ? `Delete "${name}"?` : "Delete user?",
            description:
              "This user will be marked as deleted and lose access immediately. Existing records linked to them will not be affected. You can activate them again at any time.",
            confirmLabel: "Delete",
            pendingLabel: "Deleting",
            confirmVariant: "destructive" as const,
            active: false,
          };

  const TriggerIcon = config.triggerIcon;
  const DialogIcon = config.dialogIcon;

  const handleConfirm = () => {
    changeStatus(
      { payload: action, id },
      {
        onSuccess: (res) => {
          const message =
            (res as { message?: string } | undefined)?.message ??
            `User ${config.pendingLabel.toLowerCase()}d successfully`;
          toast.success(message);
          setOpen(false);
        },
        onError: (err) => {
          toast.error(err.message ?? "Status update failed");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !isPending && setOpen(next)}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          aria-label={
            name ? `${config.triggerLabel} ${name}` : config.triggerLabel
          }
          title={config.triggerLabel}
          className={cn(
            config.active
              ? "border-green-500/40 text-green-600 hover:bg-green-500/10 hover:text-green-600"
              : "border-red-500/40 text-red-600 hover:bg-red-500/10 hover:text-red-600",
          )}
        >
          <TriggerIcon className="size-4" />
          {config.triggerLabel}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-full",
                config.active ? "bg-green-500/10" : "bg-red-500/10",
              )}
            >
              <DialogIcon
                className={cn(
                  "size-5",
                  config.active ? "text-green-600" : "text-red-600",
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
              config.active && "bg-green-600 text-white hover:bg-green-700",
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
