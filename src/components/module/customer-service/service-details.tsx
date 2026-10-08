"use client";

import { cn } from "cn";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FileText,
  Image as ImageIcon,
  MapPin,
  Phone,
  Star,
  Wallet,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { IService } from "@/types";
import type { Priority, ServiceStatus } from "@/types/common.types";
import {
  CopyId,
  formatClock,
  formatDateTime,
  formatMoney,
  formatServiceDate,
  getInitials,
  InfoRow,
  Section,
  Stars,
  SummaryCard,
  Timeline,
} from "./details-util";
import ProfileAvater from "@/shared/avater";
import { badgeText, formatDuration, statusVarient } from "@/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type Photo = { url: string; type: string };

type Props = {
  service: IService;
  backHref: string;
};

const ServiceDetailsView = ({ service, backHref }: Props) => {
  const wo = service.workOrders ?? null;
  const payment = wo?.payment ?? null;
  const schedule = wo?.schedule ?? null;
  const technician = wo?.technician ?? null;
  const manager = wo?.manager ?? null;
  const feedback = wo?.feedback ?? null;
  const serviceReport = wo?.serviceReport ?? null;
  const region = service?.region ?? null;
  const customer = service?.customer ?? null;

  const [tab, setTab] = useState<
    "ALL" | "BEFORE_PHOTO" | "AFTER_PHOTO" | "SIGNATURE" | "DOCUMENT"
  >("ALL");

  const [galleryOpen, setGalleryOpen] = useState(false);

  const photos: Photo[] = useMemo(() => {
    const list: Photo[] = [];
    wo?.attachment?.forEach((a) => {
      a.files?.forEach((f) => {
        if (f?.url) {
          list.push({ url: f.url, type: (a.type ?? "BEFORE").toUpperCase() });
        }
      });
    });
    return list;
  }, [wo]);

  const filtered =
    tab === "ALL" ? photos : photos.filter((p) => p.type === tab);
  const preview = filtered.slice(0, 3);
  const overflowCount = Math.max(filtered.length - preview.length, 0);

  const events = useMemo(
    () => [
      { key: "req", label: "Service requested", at: service.createdAt },
      {
        key: "appr",
        label:
          service.status === "REJECTED"
            ? "Rejected by manager"
            : "Approved by manager",
        at: service.reviewedAt,
      },
      { key: "assign", label: "Technician assigned", at: service.assignedAt },
      {
        key: "work",
        label: "Work started and completed",
        at: schedule?.actualStart ?? schedule?.createdAt ?? null,
        detail:
          schedule?.actualStart && schedule?.actualEnd
            ? `${formatClock(schedule.actualStart)} to ${formatClock(schedule.actualEnd)}`
            : undefined,
      },
      {
        key: "pay",
        label: "Payment received",
        at: payment?.paidAt ?? null,
        detail: payment ? formatMoney(payment.amount) : undefined,
      },
      {
        key: "fb",
        label: "Feedback and report added",
        at: feedback?.createdAt ?? serviceReport?.createdAt ?? null,
        detail:
          feedback?.createdAt && serviceReport?.createdAt
            ? `${formatClock(feedback.createdAt)} to ${formatClock(serviceReport.createdAt)}`
            : undefined,
      },
    ],
    [service, schedule, payment, feedback, serviceReport],
  );

  return (
    <div className="w-full mx-auto">
      <nav
        aria-label="Breadcrumb"
        className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground"
      >
        <Link
          href={backHref}
          className="inline-flex items-center gap-1 rounded-sm hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <ArrowLeft className="size-4" aria-hidden />
          My Services
        </Link>
        <ChevronRight className="size-3.5" aria-hidden />
        <span className="text-foreground">Service details</span>
      </nav>

      <header className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 items-start gap-3 sm:gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border bg-muted text-xl sm:size-12">
            {service.category?.icon ? (
              <span aria-hidden>{service.category.icon}</span>
            ) : (
              <Wrench className="size-5 text-muted-foreground" aria-hidden />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
              <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                {service.title === "" ? "Service title" : service.title}
              </h1>
              <Badge variant={statusVarient(service.status)}>
                {badgeText(service.status)}
              </Badge>
              <Badge variant={statusVarient(service.priority)}>
                {badgeText(service.priority)} priority
              </Badge>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-1 text-sm">
              <CopyId value={service.id} />
              <span className="text-muted-foreground">
                · {service.category.name ?? "Category Name"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-wrap gap-2 md:w-auto md:shrink-0">
          {serviceReport?.reportUrl && (
            <a
              href={serviceReport.reportUrl}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "flex-1 md:flex-none",
              )}
            >
              <Download className="size-4" />
              Download report
            </a>
          )}
        </div>
      </header>

      {/* description */}
      <Card className="mb-4">
        <CardHeader className="font-semibold">Description</CardHeader>
        <CardContent>
          <span className="text-muted-foreground">
            {service.description ?? ""}
          </span>
        </CardContent>
      </Card>

      {/* Summary cards */}
      <section
        aria-label="Summary"
        className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4"
      >
        <SummaryCard
          icon={CalendarDays}
          label="Service date"
          value={formatServiceDate(service.servicingDate)}
          sub={`${formatClock(service.preferredStartTime)} to ${formatClock(service.preferredEndTime)}`}
        />
        <SummaryCard
          icon={Clock}
          label="Duration"
          value={formatDuration(service.duration)}
          sub={`${service.category?.name ?? "-"} category`}
        />
        <SummaryCard
          icon={MapPin}
          label="Location"
          value={service.address?.city || "-"}
          sub={
            [service.address?.street, service.address?.postalCode]
              .filter(Boolean)
              .join(", ") || "-"
          }
        />
        <SummaryCard
          icon={Wallet}
          label="Amount"
          value={
            payment ? (
              formatMoney(payment.amount)
            ) : (
              <div className="flex items-center text-red-500 gap-1">
                <AlertCircle className="size-4" />
                <p className="text-sm">No payment yet</p>
              </div>
            )
          }
          badge={
            payment && (
              <Badge
                variant={payment.status === "PAID" ? "accepted" : "requested"}
              >
                {badgeText(payment.status)}
              </Badge>
            )
          }
          sub={payment?.method ?? "-"}
        />
      </section>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:items-start">
        {/* LEFT */}
        <div className="flex min-w-0 flex-col gap-4">
          <Section title="Service progress">
            <Timeline events={events} />
          </Section>

          <Section
            title={
              <>
                Attachments{" "}
                <span className="font-normal text-muted-foreground">
                  ({photos.length})
                </span>
              </>
            }
            action={
              <div className="flex gap-1.5">
                {(
                  [
                    "ALL",
                    "BEFORE_PHOTO",
                    "AFTER_PHOTO",
                    "SIGNATURE",
                    "DOCUMENT",
                  ] as const
                ).map((t) => (
                  <Button
                    key={t}
                    size="sm"
                    variant={tab === t ? "secondary" : "outline"}
                    className={cn(
                      tab === t &&
                        "bg-primary text-primary-foreground hover:bg-primary/90",
                    )}
                    onClick={() => setTab(t)}
                  >
                    {t === "ALL" && "All"}
                    {t === "BEFORE_PHOTO" && "Before"}
                    {t === "AFTER_PHOTO" && "After"}
                    {t === "SIGNATURE" && "Signature"}
                    {t === "DOCUMENT" && "Document"}
                  </Button>
                ))}
              </div>
            }
          >
            {filtered.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No {tab.toLowerCase()} photos yet.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {preview.map((p, i) => (
                  <button
                    key={`${p.url}-${i}`}
                    type="button"
                    onClick={() => setGalleryOpen(true)}
                    className="group relative aspect-square overflow-hidden rounded-xl border bg-muted"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.url}
                      alt={`${p.type} ${i + 1}`}
                      className="size-full object-cover"
                      loading="lazy"
                    />
                    <span className="absolute bottom-2 left-2 rounded-full border bg-background/90 px-2 py-0.5 text-[11px] font-medium capitalize">
                      {p.type.toLowerCase()}
                    </span>
                  </button>
                ))}
                {overflowCount > 0 || filtered.length > 3 ? (
                  <button
                    type="button"
                    onClick={() => setGalleryOpen(true)}
                    className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border bg-muted/40 text-sm hover:bg-muted"
                  >
                    <span className="text-2xl font-bold">+{overflowCount}</span>
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Eye className="size-4" /> View all
                    </span>
                  </button>
                ) : null}
              </div>
            )}

            {/* Attachments modal */}
            <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
              <DialogTrigger asChild>
                <span className="hidden" />
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>All attachments ({photos.length})</DialogTitle>
                </DialogHeader>
                <div className="grid max-h-[70vh] grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3">
                  {photos.map((p, i) => (
                    <a
                      key={`${p.url}-${i}`}
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="relative aspect-square overflow-hidden rounded-xl border bg-muted"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.url}
                        alt={`attachment ${i + 1}`}
                        className="size-full object-cover"
                        loading="lazy"
                      />
                      <span className="absolute bottom-2 left-2 rounded-full bg-background/90 px-2 py-0.5 text-[11px] capitalize">
                        {p.type.toLowerCase()}
                      </span>
                    </a>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            {serviceReport?.reportUrl && (
              <div className="mt-4 flex items-center justify-between gap-3 border-t pt-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl border bg-muted">
                    <FileText
                      className="size-5 text-muted-foreground"
                      aria-hidden
                    />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      Service report
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Uploaded {formatDateTime(serviceReport.createdAt)}
                    </p>
                  </div>
                </div>
                <a
                  href={serviceReport.reportUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                  )}
                >
                  <Eye className="size-4" /> View
                </a>
              </div>
            )}
          </Section>

          {feedback && (
            <Section>
              <div className="flex items-center gap-4">
                <p className="text-4xl font-bold">
                  {feedback.rating?.toFixed(1)}
                </p>
                <div>
                  <Stars value={feedback.rating} />
                  <p className="mt-1 text-sm text-muted-foreground">
                    Customer feedback · “{feedback.comment || "-"}”
                  </p>
                </div>
              </div>
            </Section>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex min-w-0 flex-col gap-4">
          {payment && (
            <Section title="Payment">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-2xl font-bold">
                  {formatMoney(payment?.amount)}
                </p>
                {payment && (
                  <Badge
                    variant={
                      payment.status === "PAID" ? "accepted" : "requested"
                    }
                  >
                    {badgeText(payment.status)}
                  </Badge>
                )}
              </div>
              <InfoRow label="Method" value={payment?.method ?? "-"} />
              <InfoRow
                label="Transaction"
                value={
                  <span className="font-mono text-[13px]">
                    {payment?.transectionId ?? "-"}
                  </span>
                }
              />
              <InfoRow
                label="Paid at"
                value={formatDateTime(payment?.paidAt)}
              />
            </Section>
          )}

          <Section title="People">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <ProfileAvater
                  name={customer.user.name}
                  imageUrl={customer.user.profileImg}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {customer.user.name}
                  </p>
                  <p className="text-xs text-muted-foreground">Customer</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ProfileAvater
                  name={technician?.user.name ?? "-"}
                  imageUrl={technician?.user.profileImg ?? ""}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold">
                      {technician?.user?.name ?? "Not assigned"}
                    </p>
                    {technician && <Badge variant="accepted">Available</Badge>}
                  </div>
                  {technician ? (
                    <>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                        Technician ·{" "}
                        <Star className="size-3 fill-amber-500 text-amber-500" />{" "}
                        2.95 · 2 jobs
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="size-3" /> 01712345678
                      </p>
                    </>
                  ) : (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Technician not assigned yet
                    </p>
                  )}
                </div>
              </div>

              {manager && (
                <div className="flex items-center justify-between gap-3 border-t pt-3">
                  <div className="flex items-center gap-3">
                    <ProfileAvater
                      name={manager.user.name}
                      imageUrl={manager.user.profileImg}
                    />
                    <div>
                      <p className="text-sm font-semibold">
                        {manager?.user?.name ?? "-"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Manager · approved
                      </p>
                    </div>
                  </div>
                  <ImageIcon
                    className="size-4 text-muted-foreground"
                    aria-hidden
                  />
                </div>
              )}
            </div>
          </Section>

          <Section title="Service info">
            <InfoRow label="Region" value={region.area ?? "-"} />
            <InfoRow
              label="Work order"
              value={
                <span className="font-mono">
                  {wo?.id ? (
                    `#${wo?.id?.slice(0, 8).toUpperCase()}`
                  ) : (
                    <span className="text-red-500 text-sm">Not orderd</span>
                  )}
                </span>
              }
            />
            <InfoRow
              label="Created"
              value={formatDateTime(service.createdAt)}
            />
            <InfoRow
              label="Updated"
              value={formatDateTime(service.updatedAt)}
            />
          </Section>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsView;
