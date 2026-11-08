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

const PaymentPattern = () => {
  const faint = "rgba(255,255,255,0.12)";
  const soft = "rgba(255,255,255,0.2)";
  const mid = "rgba(255,255,255,0.15)";
  const strong = "rgba(255,255,255,0.3)";
  const coin = "rgba(255,255,255,0.25)";

  return (
    <svg
      viewBox="0 0 300 96"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
    >
      <title>Payment pattern</title>

      {/* Credit cards */}
      <rect x="40" y="20" width="52" height="32" rx="4" fill={faint} />
      <rect x="48" y="26" width="14" height="4" rx="1" fill={soft} />
      <rect x="70" y="26" width="18" height="4" rx="1" fill={soft} />
      <rect x="40" y="34" width="20" height="2" rx="1" fill={soft} />

      <rect x="130" y="44" width="52" height="32" rx="4" fill={faint} />
      <rect x="138" y="50" width="14" height="4" rx="1" fill={soft} />
      <rect x="160" y="50" width="18" height="4" rx="1" fill={soft} />
      <rect x="130" y="58" width="20" height="2" rx="1" fill={soft} />

      <rect x="220" y="24" width="52" height="32" rx="4" fill={faint} />
      <rect x="228" y="30" width="14" height="4" rx="1" fill={soft} />
      <rect x="250" y="30" width="18" height="4" rx="1" fill={soft} />
      <rect x="220" y="38" width="20" height="2" rx="1" fill={soft} />

      {/* Currency symbols */}
      <path
        d="M70 62 Q80 56 90 62 T110 62 Q100 68 90 68 M85 70 Q85 74 90 74 Q95 74 95 70"
        fill={faint}
      />
      <path
        d="M160 72 Q170 66 180 72 T200 72 Q190 78 180 78 M190 80 Q190 84 195 84 Q200 84 200 80"
        fill={faint}
      />
      <path
        d="M250 66 Q260 60 270 66 T290 66 Q280 72 270 72 M265 74 Q265 78 270 78 Q275 78 275 74"
        fill={faint}
      />

      {/* Wallet / bill shapes */}
      <path d="M20 68 H52 V84 H20 Z" fill={mid} />
      <rect x="28" y="72" width="12" height="4" rx="1" fill={strong} />
      <rect x="28" y="78" width="8" height="2" rx="1" fill={strong} />
      <path d="M110 68 H142 V84 H110 Z" fill={mid} />
      <rect x="118" y="72" width="12" height="4" rx="1" fill={strong} />
      <rect x="118" y="78" width="8" height="2" rx="1" fill={strong} />
      <path d="M200 68 H232 V84 H200 Z" fill={mid} />
      <rect x="208" y="72" width="12" height="4" rx="1" fill={strong} />
      <rect x="208" y="78" width="8" height="2" rx="1" fill={strong} />

      {/* Coins */}
      <circle cx="180" cy="34" r="10" fill={mid} />
      <circle cx="180" cy="34" r="6" fill={coin} />
      <circle cx="260" cy="80" r="12" fill={mid} />
      <circle cx="260" cy="80" r="7" fill={coin} />
    </svg>
  );
};

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
      {/* Amount banner — isolate makes -z-10 stay inside this banner */}
      <div className="relative isolate overflow-hidden bg-primary px-5 pt-4 pb-4 sm:px-6 text-white">
        <PaymentPattern />
        <div className="relative mb-3 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-foreground">
            <Wallet className="size-3.5 text-primary-foreground" aria-hidden />
            {payment.method || "bKash"}
          </span>
          <Badge
            variant={statusVarient(payment.status)}
            className="text-primary-foreground"
          >
            {badgeText(payment.status)}
          </Badge>
        </div>

        <h3 className="relative mt-3 line-clamp-1 text-[15px] font-semibold leading-snug tracking-tight">
          {serviceTitle}
        </h3>
        <div className="relative mt-1 flex items-baseline gap-1.5">
          <span className="text-xs font-semibold tracking-wide opacity-90">
            {payment.currency || "BDT"}
          </span>
          <span className="text-2xl font-bold tracking-tight">
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
            <p className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
              <Mail className="size-4 shrink-0" aria-hidden />
              Invoice sent to your email
            </p>
          ) : (
            <>
              <PaymentBtn
                workOrderId={workOrder?.id ?? payment.workOrderId}
                disabled={!canPay}
                className="h-9 w-full text-[15px] font-semibold"
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