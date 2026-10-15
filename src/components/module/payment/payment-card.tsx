"use client";

import { CalendarDays, Mail, ReceiptText, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import PaymentBtn from "@/shared/payment.btn";
import type { IPayment } from "@/types";
import { badgeText, statusVarient } from "@/utils";

const serviceDateFmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Dhaka",
  day: "numeric",
  month: "short",
  year: "numeric",
});

const paidAtDateFmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Dhaka",
  day: "numeric",
  month: "short",
  year: "numeric",
});

const paidAtTimeFmt = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Dhaka",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

function formatServiceDateShort(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return serviceDateFmt.format(d);
}

function formatPaidAt(iso?: string | null) {
  if (!iso) return "Not paid yet";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${paidAtDateFmt.format(d)}, ${paidAtTimeFmt.format(d)}`;
}

function formatAmount(amount: number | string) {
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  if (Number.isNaN(n)) return `${amount}`;
  return n.toLocaleString("en-US");
}

function headerTint(status: IPayment["status"]) {
  switch (status) {
    case "PAID":
      return "from-emerald-500/15 via-emerald-500/5 to-transparent";
    case "UNPAID":
      return "from-amber-500/15 via-amber-500/5 to-transparent";
    case "FAILED":
    case "CANCELLED":
      return "from-destructive/15 via-destructive/5 to-transparent";
    case "REFUNDED":
      return "from-muted via-muted/50 to-transparent";
    default:
      return "from-primary/15 via-primary/5 to-transparent";
  }
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-2.5 text-sm last:border-0">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className="min-w-0 truncate text-right font-semibold text-foreground">
        {value}
      </span>
    </div>
  );
}

const PaymentCard = ({ payment }: { payment: IPayment }) => {
  const workOrder = payment.workOrder;
  const isPaid = payment.status === "PAID";
  const technicianName = workOrder?.technician?.user?.name ?? "—";
  const serviceTitle = workOrder?.service?.title ?? "Service payment";

  const canPay =
    workOrder.status === "COMPLETED" || workOrder.status === "STARTED";

  return (
    <Card
      className={cn(
        "h-full overflow-hidden py-0 transition-all hover:-translate-y-1 hover:shadow-lg",
        isPaid
          ? "hover:border-emerald-500/30 hover:shadow-emerald-500/5"
          : "hover:border-primary/30 hover:shadow-primary/5",
      )}
    >
      {/* Amount banner */}
      <div
        className={cn(
          "bg-gradient-to-r px-5 pt-4 pb-4 sm:px-6",
          headerTint(payment.status),
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <Badge variant={statusVarient(payment.status)}>
            {badgeText(payment.status)}
          </Badge>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Wallet className="size-3.5" aria-hidden />
            {payment.method || "bKash"}
          </span>
        </div>

        <h3 className="mt-3 line-clamp-1 text-[15px] font-semibold leading-snug tracking-tight text-foreground">
          {serviceTitle}
        </h3>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-xs font-semibold tracking-wide text-muted-foreground">
            {payment.currency || "BDT"}
          </span>
          <span className="text-2xl font-bold tracking-tight text-foreground">
            ৳{formatAmount(payment.amount)}
          </span>
        </div>
      </div>

      <CardContent className="flex flex-1 flex-col px-5 pb-5 sm:px-6 sm:pb-6">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarDays className="size-3.5 shrink-0" aria-hidden />
          {formatServiceDateShort(workOrder?.servicingDate)}
          <span aria-hidden>·</span>
          <ReceiptText className="size-3.5 shrink-0" aria-hidden />
          <span className="truncate font-mono text-[11px]">
            {payment.paymentId}
          </span>
        </div>

        <div className="mt-2 border-t border-border pt-1">
          <Row label="Technician" value={technicianName} />
          {!isPaid && workOrder?.status && (
            <Row label="Work status" value={badgeText(workOrder.status)} />
          )}
          <Row
            label="Transaction ID"
            value={payment.transectionId ?? "Not paid yet"}
          />
          {isPaid && (
            <Row label="Paid on" value={formatPaidAt(payment.paidAt)} />
          )}
        </div>

        <div className="mt-auto pt-3">
          {isPaid ? (
            <p className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2.5 text-sm font-medium text-emerald-700 dark:text-emerald-400">
              <Mail className="size-4 shrink-0" aria-hidden />
              Invoice sent to your email
            </p>
          ) : (
            <>
              <PaymentBtn
                workOrderId={workOrder?.id ?? payment.workOrderId}
                disabled={!canPay}
                className="h-10 w-full text-[15px] font-semibold"
              >
                Pay now
              </PaymentBtn>
              {workOrder.status === "EN_ROUTE" && (
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  Payment unlocks once the service is in progress
                </p>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentCard;
