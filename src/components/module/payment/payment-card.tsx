"use client";

import { Mail } from "lucide-react";
import PaymentBtn from "@/shared/payment.btn";
import type { IPayment } from "@/types";
import { badgeText } from "@/utils";

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

function headerBg(status: IPayment["status"]) {
  switch (status) {
    case "PAID":
      return "bg-[#0B4D2C]";
    case "UNPAID":
      return "bg-[#7C3408]";
    case "FAILED":
    case "CANCELLED":
      return "bg-[#7F1D1D]";
    case "REFUNDED":
      return "bg-[#57534E]";
    default:
      return "bg-[#7C3408]";
  }
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-stone-100 py-2.5 text-sm last:border-0 dark:border-white/10">
      <span className="shrink-0 text-stone-500 dark:text-stone-400">
        {label}
      </span>
      <span className="min-w-0 truncate text-right font-semibold text-stone-900 dark:text-stone-100">
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
    <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 dark:bg-card dark:ring-white/10">
      <div className={`${headerBg(payment.status)} px-5 pt-4 pb-4 text-white`}>
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-900">
            {badgeText(payment.status)}
          </span>
          <span className="text-sm font-medium text-white/90">
            {payment.method || "bKash"}
          </span>
        </div>

        <h3 className="mt-3 line-clamp-1 text-[15px] font-semibold leading-snug">
          {serviceTitle}
        </h3>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-xs font-bold tracking-wide text-white/80">
            {payment.currency || "BDT"}
          </span>
          <span className="text-xl font-extrabold tracking-tight">
            {formatAmount(payment.amount)}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 pt-2 pb-4">
        <div>
          <Row label="Technician" value={technicianName} />
          <Row
            label="Service date"
            value={formatServiceDateShort(workOrder?.servicingDate)}
          />
          {!isPaid && workOrder?.status && (
            <Row label="Work status" value={badgeText(workOrder.status)} />
          )}

          {/* <p className="pt-3 pb-1 text-[11px] font-semibold tracking-[0.14em] text-stone-500 uppercase dark:text-stone-400">
            Payment
          </p> */}
          <Row label="Payment ID" value={payment.paymentId} />
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
            <p className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-300">
              <Mail
                className="size-4 shrink-0 text-[#0B4D2C] dark:text-emerald-400"
                aria-hidden
              />
              Invoice sent to your email
            </p>
          ) : (
            <>
              <PaymentBtn
                workOrderId={workOrder?.id ?? payment.workOrderId}
                disabled={!canPay}
                className="h-8 w-full rounded-xl bg-[#B91C1C] text-base font-semibold text-white shadow-none hover:bg-[#991B1B] dark:bg-[#B91C1C] dark:text-white dark:hover:bg-[#991B1B]"
              >
                Pay now
              </PaymentBtn>
              {workOrder.status === "EN_ROUTE" && (
                <p className="text-sm text-red-400 text-center">
                  Button will be enalble if service in-progress
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentCard;
