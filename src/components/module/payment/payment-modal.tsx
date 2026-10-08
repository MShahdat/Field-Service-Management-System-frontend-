"use client";

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
import {
  CopyId,
  formatDateTime,
  formatMoney,
  formatServiceDate,
  InfoRow,
} from "../customer-service/details-util";

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
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Payment details</DialogTitle>
          <DialogDescription className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <CopyId value={payment.paymentId} />
            <span aria-hidden>·</span>
            <span>{service?.title ?? "Service payment"}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Summary */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-muted px-4 py-3">
            <div>
              <p className="text-xs text-muted-foreground">
                {payment.currency || "BDT"} · {payment.method || "bKash"}
              </p>
              <p className="text-xl font-extrabold tracking-tight">
                {formatMoney(payment.amount)}
              </p>
            </div>
            <Badge
              variant={statusVarient(
                payment.status === "PAID" ? "COMPLETED" : "PENDING",
              )}
            >
              {badgeText(payment.status)}
            </Badge>
          </div>

          {/* Payment info */}
          <div>
            <h3 className="mb-1 text-sm font-semibold">Payment info</h3>
            <div className="rounded-xl border px-3 py-1">
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
                    <p className="text-red-500">Not paid yet</p>
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
            </div>
          </div>

          {/* Work order / service */}
          <div>
            <h3 className="mb-1 text-sm font-semibold">Service</h3>
            <div className="rounded-xl border px-3 py-1">
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
            </div>
          </div>

          {/* People */}
          <div>
            <h3 className="mb-1 text-sm font-semibold">People</h3>
            <div className="rounded-xl border px-3 py-1">
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
            </div>
          </div>

          {/* Refund */}
          {hasRefund && (
            <div>
              <h3 className="mb-1 text-sm font-semibold">Refund</h3>
              <div className="rounded-xl border px-3 py-1">
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
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
