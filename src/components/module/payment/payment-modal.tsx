"use client";

import {
  BriefcaseBusiness,
  ReceiptText,
  Undo2,
  UsersRound,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { IPayment } from "@/types";
import { badgeText, statusVarient } from "@/utils";
import { CopyId, formatDateTime, formatMoney, formatServiceDate, InfoRow } from "../services/details-util";

export function PaymentDetails({ payment }: { payment: IPayment }) {
  const workOrder = payment.workOrder;
  const service = workOrder?.service;
  const technician = workOrder?.technician;
  const customer = workOrder?.customer;
  const manager = workOrder?.manager;

  const hasRefund =
    payment.refundTrxId != null ||
    payment.refundAmount != null ||
    payment.refundedAt != null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"sm"} variant="accepted">
          Details
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[calc(100dvh-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl border-border p-0 sm:max-w-lg">
        {/* Themed header */}
        <DialogHeader className="relative shrink-0 gap-1 overflow-hidden bg-primary px-5 pt-5 pb-5 sm:px-6">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 size-44 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-16 left-24 size-40 rounded-full bg-black/10 blur-2xl" />
          </div>
          <div className="relative flex items-start gap-3 pr-8">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-white/25 backdrop-blur">
              <ReceiptText className="size-5" />
            </span>
            <div className="min-w-0">
              <DialogTitle className="text-base font-bold tracking-tight text-white sm:text-lg">
                Payment details
              </DialogTitle>
              <DialogDescription className="mt-1 truncate text-[13px] leading-relaxed text-white/80">
                {service?.title ?? "Service payment"} ·{" "}
                {payment.currency || "BDT"} · {payment.method || "bKash"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          <div className="space-y-4">
            {/* Summary */}
            <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/[0.08] via-card to-card">
              <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <CopyId value={payment.paymentId} />
                  </div>
                  <p className="mt-1.5 truncate text-2xl font-extrabold tracking-tight text-foreground tabular-nums">
                    {formatMoney(payment.amount)}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {payment.currency || "BDT"} · {payment.method || "bKash"}
                  </p>
                </div>
                <Badge
                  variant={statusVarient(
                    payment.status === "PAID" ? "COMPLETED" : "PENDING",
                  )}
                  className="w-fit shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold shadow-none ring-1 ring-border"
                >
                  <span className="size-1.5 rounded-full bg-current" />
                  {badgeText(payment.status)}
                </Badge>
              </div>
            </div>

            {/* Payment info */}
            <ModalSection
              step="01"
              icon={<Wallet className="size-4" />}
              title="Payment info"
            >
              <InfoRow
                label="Payment ID"
                value={
                  <span className="font-mono text-xs break-all">
                    {payment.paymentId}
                  </span>
                }
              />
              <InfoRow
                label="Merchant invoice"
                value={payment.merchantInvoiceNumber || "—"}
              />
              <InfoRow
                label="Transaction ID"
                value={
                  payment.transectionId ? (
                    <span className="font-mono text-xs break-all">
                      {payment.transectionId}
                    </span>
                  ) : (
                    <p className="font-medium text-destructive">Not paid yet</p>
                  )
                }
              />
              <InfoRow
                label="Payer reference"
                value={payment.payerReference || "—"}
              />
              <InfoRow
                label="Paid at"
                value={
                  payment.paidAt
                    ? formatDateTime(payment.paidAt)
                    : "Not paid yet"
                }
              />
              {payment.reason && (
                <InfoRow label="Reason" value={payment.reason} />
              )}
            </ModalSection>

            {/* Work order / service */}
            <ModalSection
              step="02"
              icon={<BriefcaseBusiness className="size-4" />}
              title="Service"
            >
              <InfoRow label="Title" value={service?.title ?? "—"} />
              <InfoRow
                label="Category"
                value={service?.category?.name ?? "—"}
              />
              <InfoRow
                label="Servicing date"
                value={formatServiceDate(workOrder?.servicingDate)}
              />
              <InfoRow
                label="Work status"
                value={workOrder?.status ? badgeText(workOrder.status) : "—"}
              />
            </ModalSection>

            {/* People */}
            <ModalSection
              step="03"
              icon={<UsersRound className="size-4" />}
              title="People"
            >
              <InfoRow
                label="Technician"
                value={technician?.user?.name ?? "Not assigned"}
              />
              <InfoRow label="Customer" value={customer?.user?.name ?? "—"} />
              {customer?.phone && (
                <InfoRow label="Customer phone" value={customer.phone} />
              )}
              {manager?.user?.name && (
                <InfoRow label="Manager" value={manager.user.name} />
              )}
            </ModalSection>

            {/* Refund */}
            {hasRefund && (
              <ModalSection
                step="04"
                icon={<Undo2 className="size-4" />}
                title="Refund"
                tone="amber"
              >
                <InfoRow
                  label="Refund Trx ID"
                  value={payment.refundTrxId ?? "—"}
                />
                <InfoRow
                  label="Refund amount"
                  value={
                    payment.refundAmount != null
                      ? formatMoney(payment.refundAmount)
                      : "—"
                  }
                />
                <InfoRow
                  label="Refunded at"
                  value={
                    payment.refundedAt
                      ? formatDateTime(payment.refundedAt)
                      : "—"
                  }
                />
              </ModalSection>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ModalSection({
  step,
  icon,
  title,
  tone = "primary",
  children,
}: {
  step: string;
  icon: React.ReactNode;
  title: string;
  tone?: "primary" | "amber";
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card">
      <header className="flex items-center gap-3 border-b border-border/70 bg-muted/40 px-4 py-3">
        <span
          className={
            tone === "amber"
              ? "flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-sm font-extrabold text-amber-700 ring-1 ring-amber-500/25 dark:text-amber-400"
              : "flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-extrabold text-primary-foreground shadow-sm"
          }
        >
          {step}
        </span>
        <h3 className="flex min-w-0 items-center gap-1.5 truncate text-sm font-bold text-foreground">
          <span
            className={
              tone === "amber"
                ? "text-amber-600 dark:text-amber-400"
                : "text-primary"
            }
          >
            {icon}
          </span>
          {title}
        </h3>
      </header>
      <div className="px-4 py-3">{children}</div>
    </section>
  );
}
