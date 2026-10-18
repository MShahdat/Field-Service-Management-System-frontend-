"use client";

import {
  ArrowRight,
  CalendarDays,
  Clock,
  Hourglass,
  MapPin,
  Package,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProfileAvater from "@/shared/avater";
import PaymentBtn from "@/shared/payment.btn";
import type { IWorkOrder } from "@/types";
import { badgeText, statusVarient } from "@/utils";
import { formatClock, formatServiceDate } from "../services/details-util";


type Props = {
  order: IWorkOrder;
  route: string
};

const OrderCard = ({ order, route }: Props) => {
  const router = useRouter();
  const params = new URLSearchParams({ id: order.id });
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
    <Card className="h-full overflow-hidden py-0 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      {/* Order banner */}
      <div className="flex items-center gap-3 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent px-5 pt-4 pb-3.5 sm:px-6">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/30">
          <Package className="size-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">
            Order #{order.id.slice(0, 8).toUpperCase()}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {order.service?.category?.name ?? "Service"}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
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
      </div>

      <CardContent className="flex h-full flex-col px-5 pb-5 sm:px-6 sm:pb-6">
        <h3 className="mt-1 line-clamp-1 text-lg font-semibold leading-snug tracking-tight text-card-foreground">
          {order.service?.title || "Service order"}
        </h3>

        {/* Schedule panel */}
        <div className="mt-3.5 space-y-1.5 rounded-xl bg-secondary/70 p-2.5 dark:bg-secondary/40">
          <div className="flex items-center gap-2">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-card text-primary shadow-xs">
              <CalendarDays className="size-3.5" aria-hidden />
            </span>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Date
            </p>
            <p className="ml-auto text-[13px] font-semibold text-foreground">
              {formatServiceDate(order.servicingDate)}
            </p>
          </div>
          <div className="flex items-center gap-2 border-t border-border/60 pt-1.5">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-card text-primary shadow-xs">
              <Clock className="size-3.5" aria-hidden />
            </span>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Time
            </p>
            <p className="ml-auto text-[13px] font-semibold whitespace-nowrap text-foreground">
              {`${formatClock(order.service.preferredStartTime)} - ${formatClock(order.service.preferredEndTime)}`}
            </p>
          </div>
        </div>

        {order.service?.address?.city && (
          <p className="mt-2.5 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" aria-hidden />
            {order.service.address.city}
          </p>
        )}

        <div className="mt-3.5">
          {technician ? (
            <div className="flex items-center gap-2.5 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2.5">
              <ProfileAvater
                name={technician.user.name}
                imageUrl={technician.user.profileImg}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {technician.user.name}
                </p>
                <p className="text-xs text-muted-foreground">Your technician</p>
              </div>
              <span
                aria-hidden
                className="size-2 shrink-0 rounded-full bg-emerald-500"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2.5 rounded-xl border-[1.5px] border-dashed border-amber-500/40 bg-amber-500/5 px-3 py-2.5">
              <Hourglass
                className="size-5 shrink-0 text-amber-600 dark:text-amber-400"
                aria-hidden
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  Technician not assigned yet
                </p>
                <p className="text-xs leading-snug text-muted-foreground">
                  A manager will assign one after reviewing your request.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-2 pt-1">
          {isPayBtn && <PaymentBtn workOrderId={order.id} />}
          <Button
            type="button"
            className={"flex-1"}
            onClick={() => {
              router.replace(`${route}/details?${params.toString()}`)
            }}
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
