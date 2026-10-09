"use client";

import { ArrowRight, CalendarDays, Clock, Hourglass } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProfileAvater from "@/shared/avater";
import type { IWorkOrder } from "@/types";
import { badgeText, statusVarient } from "@/utils";
import { formatClock, formatServiceDate } from "./details-util";
import PaymentBtn from "@/shared/payment.btn";

type Props = {
  order: IWorkOrder;
};

const OrderCard = ({ order }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const technician = order.technician;

  // console.log('order feedback', order.feedback)

  const paymentBadge = order.payment
    ? order.payment.status === "PAID"
      ? "COMPLETED"
      : "PENDING"
    : null;

  const isPayBtn =
    (order.status === "STARTED" || order.status === "COMPLETED") &&
    order.payment?.status === "UNPAID";

  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <Badge variant={statusVarient(order.status)}>
            {badgeText(order.status)}
          </Badge>
          {paymentBadge ? (
            <Badge variant={statusVarient(paymentBadge)}>
              {order.payment ? badgeText(order.payment.status) : ""}
            </Badge>
          ) : (
            <Badge variant="secondary">No payment</Badge>
          )}
        </div>

        <div>
          <h3 className="line-clamp-1 text-base font-bold leading-snug text-card-foreground">
            {order.service?.title || "Service order"}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Order #{order.id.slice(0, 8).toUpperCase()} ·{" "}
            {order.service?.category?.name ?? "Service"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="requested">
            <CalendarDays className="size-3.5" aria-hidden />
            {formatServiceDate(order.servicingDate)}
          </Badge>
          <Badge variant="accepted">
            <Clock className="size-3.5" aria-hidden />
            {`${formatClock(order.service.preferredStartTime)} - ${formatClock(order.service.preferredEndTime)}`}
          </Badge>
        </div>

        {technician ? (
          <div className="flex items-center gap-2.5 rounded-xl bg-muted px-3 py-2.5">
            <ProfileAvater
              name={technician.user.name}
              imageUrl={technician.user.profileImg}
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-foreground">
                {technician.user.name}
              </p>
              <p className="text-xs text-muted-foreground">Your technician</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 rounded-xl border-[1.5px] border-dashed border-border px-3 py-2.5">
            <Hourglass
              className="size-5 shrink-0 text-amber-600 dark:text-amber-400"
              aria-hidden
            />
            <div>
              <p className="text-sm font-bold text-foreground">
                Technician not assigned yet
              </p>
              <p className="text-xs leading-snug text-muted-foreground">
                A manager will assign one after reviewing your request.
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-2 justify-end mt-auto">
          {isPayBtn && <PaymentBtn workOrderId={order.id} />}
          <Button
            type="button"
            variant="secondary"
            className={"flex-1"}
            onClick={() => router.push(`${pathname}/${order.id}`)}
          >
            View details
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
