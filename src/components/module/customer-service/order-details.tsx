"use client";

import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  MapPin,
  Phone,
  User,
  Wallet,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ProfileAvater from "@/shared/avater";
import type { IWorkOrder } from "@/types";
import { badgeText, statusVarient } from "@/utils";
import {
  CopyId,
  formatClock,
  formatDateTime,
  formatMoney,
  formatServiceDate,
  InfoRow,
  Section,
  Stars,
  SummaryCard,
  Timeline,
} from "./details-util";
import { Button } from "@/components/ui/button";
import PaymentBtn from "@/shared/payment.btn";

type Props = {
  order: IWorkOrder;
  backHref: string;
  label: string;
};

const OrderDetailsView = ({ order, backHref, label }: Props) => {
  const service = order.service;
  const payment = order.payment;
  const schedule = order.schedule;
  const technician = order.technician;
  const manager = order.manager;
  const customer = order.customer;
  const feedback = order.feedback;

  const events = useMemo(
    () => [
      { key: "created", label: "Order created", at: order.createdAt },
      {
        key: "scheduled",
        label: "Servicing scheduled",
        at: order.servicingDate,
      },
      {
        key: "started",
        label: "Work started",
        at: schedule?.actualStart ?? null,
      },
      {
        key: "completed",
        label:
          order.status === "CANCELLED" ? "Order cancelled" : "Work completed",
        at: schedule?.actualEnd ?? null,
      },
      {
        key: "paid",
        label: "Payment received",
        at: payment?.paidAt ?? null,
        detail: payment ? formatMoney(payment.amount) : undefined,
      },
    ],
    [order, payment, schedule],
  );

  const attachments = useMemo(
    () => (order.attachment ?? []).filter((a) => !a.isDelete),
    [order],
  );

  const isPayBtn =
    (order.status === "STARTED" || order.status === "COMPLETED") &&
    order.payment?.status === "UNPAID";

  return (
    <div className="space-y-4">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-sm text-muted-foreground"
      >
        <Link
          href={backHref}
          className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          {label}
        </Link>
        <ChevronRight className="size-3.5" aria-hidden />
        <span className="font-medium text-foreground">Order details</span>
      </nav>

      <Card className="shadow-none">
        <CardContent className="flex flex-col gap-4 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted">
              <Wrench className="size-5 text-muted-foreground" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-bold leading-tight sm:text-xl">
                  {service?.title ?? "Service order"}
                </h1>
                <Badge variant={statusVarient(order.status)}>
                  {badgeText(order.status)}
                </Badge>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <CopyId value={order.id} />
                <span aria-hidden>·</span>
                <span>{service?.category?.name ?? "Service"}</span>
                <span aria-hidden>·</span>
                <span>{formatServiceDate(order.servicingDate)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryCard
          icon={CalendarDays}
          label="Servicing date"
          value={formatServiceDate(order.servicingDate)}
          sub={`${formatClock(service.preferredStartTime)} to ${formatClock(service.preferredEndTime)}`}
        />
        <SummaryCard
          icon={User}
          label="Technician"
          value={technician ? technician.user.name : "Not assigned"}
          sub={
            technician
              ? `${technician.jobsCompleted} jobs completed`
              : "Waiting for manager"
          }
        />
        <SummaryCard
          icon={Wallet}
          label="Amount"
          value={payment ? formatMoney(payment.amount) : "—"}
          badge={
            payment ? (
              <Badge
                variant={statusVarient(
                  payment.status === "PAID" ? "COMPLETED" : "PENDING",
                )}
              >
                {badgeText(payment.status)}
              </Badge>
            ) : undefined
          }
          sub={payment ? payment.method : "No payment yet"}
        />
        <SummaryCard
          icon={MapPin}
          label="Service area"
          value={service?.region?.area ?? "—"}
          sub={service?.address?.city ?? service?.address?.street ?? ""}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <Section title="Service progress">
            <Timeline events={events} />
          </Section>

          <Section title="Service info">
            <p className="text-sm font-semibold">{service?.title ?? "—"}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {service?.description ?? "No description provided."}
            </p>
            {order.note && (
              <p className="mt-3 rounded-xl bg-muted px-3 py-2.5 text-sm">
                <span className="font-semibold">Order note: </span>
                {order.note}
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              {service && (
                <>
                  <Badge variant={statusVarient(service.priority)}>
                    {badgeText(service.priority)}
                  </Badge>
                  <Badge variant={statusVarient(service.status)}>
                    {badgeText(service.status)}
                  </Badge>
                </>
              )}
            </div>
          </Section>

          <Section
            title="Attachments"
            action={
              <span className="text-xs text-muted-foreground">
                {attachments.length} file
                {attachments.length === 1 ? "" : "s"}
              </span>
            }
          >
            {attachments.length === 0 ? (
              <p className="py-2 text-sm text-muted-foreground">
                No attachments uploaded for this order.
              </p>
            ) : (
              <ul className="space-y-2">
                {attachments.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center justify-between gap-3 rounded-xl border px-3 py-2 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {a.description || badgeText(a.type)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {badgeText(a.type)} · {a.files.length} file
                        {a.files.length === 1 ? "" : "s"}
                      </p>
                    </div>
                    {a.files[0]?.url && (
                      <Link
                        href={a.files[0].url}
                        target="_blank"
                        className="shrink-0 text-xs font-semibold text-primary hover:underline"
                      >
                        View
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section title="Feedback">
            {feedback ? (
              <div className="space-y-1.5">
                <Stars value={feedback.rating} />
                <p className="text-sm leading-relaxed">
                  {feedback.comment || "No comment provided."}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(feedback.createdAt)}
                </p>
              </div>
            ) : (
              <p className="py-2 text-sm text-muted-foreground">
                No feedback submitted for this order yet.
              </p>
            )}
          </Section>
        </div>

        <div className="space-y-4">
          <Section
            title="Payment"
            action={isPayBtn && <PaymentBtn workOrderId={order.id} />}
          >
            {payment ? (
              <div>
                <InfoRow label="Amount" value={formatMoney(payment.amount)} />
                <InfoRow label="Status" value={badgeText(payment.status)} />
                <InfoRow label="Method" value={payment.method} />
                <InfoRow
                  label="Transaction ID"
                  value={payment.transectionId ?? "—"}
                />
                <InfoRow
                  label="Paid at"
                  value={
                    payment.paidAt
                      ? formatDateTime(payment.paidAt)
                      : "Not paid yet"
                  }
                />
              </div>
            ) : (
              <p className="py-2 text-sm text-muted-foreground">
                No payment record for this order.
              </p>
            )}
          </Section>

          <Section title="People">
            <div className="space-y-3">
              {customer && (
                <div className="flex items-center gap-2.5">
                  <ProfileAvater
                    name={customer.user.name}
                    imageUrl={customer.user.profileImg}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {customer.user.name}
                    </p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <User className="size-3" aria-hidden /> Customer
                      {customer.phone && (
                        <span className="inline-flex items-center gap-1">
                          · <Phone className="size-3" aria-hidden />
                          {customer.phone}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              )}
              {technician ? (
                <div className="flex items-center gap-2.5">
                  <ProfileAvater
                    name={technician.user.name}
                    imageUrl={technician.user.profileImg}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {technician.user.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Technician · ★ {technician.rating.toFixed(1)}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Technician not assigned yet.
                </p>
              )}
              {manager && (
                <div className="flex items-center gap-2.5">
                  <ProfileAvater
                    name={manager.user.name}
                    imageUrl={manager.user.profileImg}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {manager.user.name}
                    </p>
                    <p className="text-xs text-muted-foreground">Manager</p>
                  </div>
                </div>
              )}
            </div>
          </Section>

          <Section title="Order info">
            <InfoRow
              label="Order ID"
              value={
                <span className="font-mono text-xs">
                  #{order.id.slice(0, 8).toUpperCase()}
                </span>
              }
            />
            <InfoRow label="Status" value={badgeText(order.status)} />
            <InfoRow label="Created" value={formatDateTime(order.createdAt)} />
            <InfoRow
              label="Last updated"
              value={formatDateTime(order.updatedAt)}
            />
          </Section>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsView;
