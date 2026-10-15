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
            "rounded-lg shadow-sm",
            config.active
              ? "border-emerald-500/40 text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-400"
              : "border-red-500/40 text-red-600 hover:bg-red-500/10 hover:text-red-600 dark:text-red-400 dark:hover:text-red-400",
          )}
        >
          <TriggerIcon className="size-4" />
          {config.triggerLabel}
        </Button>
      </DialogTrigger>

      <DialogContent className="gap-0 overflow-hidden rounded-2xl border-border p-0 sm:max-w-md">
        <div
          className={cn(
            "h-1.5",
            config.active
              ? "bg-gradient-to-r from-emerald-500 to-emerald-500/30"
              : "bg-gradient-to-r from-red-500 to-red-500/30",
          )}
        />
        <div className="px-5 pt-5 sm:px-6">
          <DialogHeader>
            <div className="flex items-start gap-3.5">
              <span
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-2xl ring-1",
                  config.active
                    ? "bg-emerald-500/10 text-emerald-600 ring-emerald-500/25 dark:text-emerald-400"
                    : "bg-red-500/10 text-red-600 ring-red-500/25 dark:text-red-400",
                )}
              >
                <DialogIcon className="size-5" />
              </span>
              <div className="min-w-0 space-y-1 pt-0.5">
                <DialogTitle className="text-[15px] font-bold tracking-tight text-foreground">
                  {config.title}
                </DialogTitle>
                <DialogDescription className="text-[13px] leading-relaxed">
                  {config.description}
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
            variant={config.confirmVariant}
            className={cn(
              "w-full rounded-xl font-semibold shadow-sm sm:w-auto",
              config.active && "bg-emerald-600 text-white hover:bg-emerald-700",
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
