"use client";

import { CircleCheck, Play } from "lucide-react";
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
import { useUpdateOrderStatus } from "@/hooks";
import type { IWorkOrder } from "@/types";

type Props = {
  order: IWorkOrder;
};

const OrderStatusModal = ({ order }: Props) => {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useUpdateOrderStatus();

  if (order.status !== "EN_ROUTE" && order.status !== "STARTED") {
    return null;
  }

  const target = order.status === "EN_ROUTE" ? "STARTED" : "COMPLETED";

  const config =
    target === "STARTED"
      ? {
          icon: Play,
          label: "Start",
          title: "Start this order?",
          description: `Order #${order.id.slice(0, 8).toUpperCase()} will move from En Route to Started.`,
          confirmLabel: "Start order",
        }
      : {
          icon: CircleCheck,
          label: "Complete",
          title: "Complete this order?",
          description: `Order #${order.id.slice(0, 8).toUpperCase()} will move from Started to Completed.`,
          confirmLabel: "Complete order",
        };

  const Icon = config.icon;

  const handleConfirm = () => {
    mutate(
      { workOrderId: order.id, status: target },
      {
        onSuccess: (res) => {
          toast.success(res.message);
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
        <Button type="button" size="sm" variant="accepted">
          <Icon className="size-4" aria-hidden />
          {config.label}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
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
            variant="accepted"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Spinner /> Updating
              </>
            ) : (
              config.confirmLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderStatusModal;
