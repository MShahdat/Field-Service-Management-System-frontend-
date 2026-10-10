"use client";

import { cn } from "cn";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  ChevronLeft,
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
import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProfileAvater from "@/shared/avater";
import PaymentBtn from "@/shared/payment.btn";
import type { IService } from "@/types";
import { badgeText, formatDuration, statusVarient } from "@/utils";
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
import Image from "next/image";

type Photo = { url: string; type: string; description?: string };

type GalleryTab = "ALL" | "BEFORE_PHOTO" | "AFTER_PHOTO" | "SIGNATURE";

const IMAGE_URL_RE = /\.(png|jpe?g|webp)(\?|#|$)/i;

type Props = {
  service: IService;
  backHref: string;
  label?: string
};

const ServiceDetailsView = ({ service, backHref, label }: Props) => {
  const wo = service.workOrders ?? null;
  const payment = wo?.payment ?? null;
  const schedule = wo?.schedule ?? null;
  const technician = wo?.technician ?? null;
  const manager = wo?.manager ?? null;
  const feedback = wo?.feedback ?? null;
  const serviceReport = wo?.serviceReport ?? null;
  const region = service?.region ?? null;
  const customer = service?.customer ?? null;

  const [tab, setTab] = useState<GalleryTab>("ALL");

  // Lightbox index into `filtered` (null = closed). Replaces old galleryOpen boolean.
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Images only: skip soft-deleted attachments, DOCUMENT type, and non-image urls.
  // Upload still allows pdf/doc — they are just hidden from this gallery.
  const photos: Photo[] = useMemo(() => {
    const list: Photo[] = [];
    wo?.attachment
      ?.filter((a) => !a.isDelete)
      .forEach((a) => {
        if ((a.type ?? "").toUpperCase() === "DOCUMENT") return;
        a.files?.forEach((f) => {
          if (f?.url && IMAGE_URL_RE.test(f.url)) {
            list.push({
              url: f.url,
              type: (a.type ?? "BEFORE_PHOTO").toUpperCase(),
              description: a.description,
            });
          }
        });
      });
    return list;
  }, [wo]);

  const filtered =
    tab === "ALL" ? photos : photos.filter((p) => p.type === tab);
  const preview = filtered.slice(0, 3);
  const overflowCount = Math.max(filtered.length - preview.length, 0);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const goPrev = useCallback(() => {
    setLightboxIndex((i) =>
      i === null || filtered.length === 0
        ? i
        : (i - 1 + filtered.length) % filtered.length,
    );
  }, [filtered.length]);
  const goNext = useCallback(() => {
    setLightboxIndex((i) =>
      i === null || filtered.length === 0 ? i : (i + 1) % filtered.length,
    );
  }, [filtered.length]);

  const handleTabChange = (t: GalleryTab) => {
    setTab(t);
    setLightboxIndex(null);
  };

  // Keyboard navigation while lightbox is open.
  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, goPrev, goNext, closeLightbox]);

  // Clamp index when filter changes underneath an open lightbox.
  useEffect(() => {
    if (lightboxIndex !== null && lightboxIndex >= filtered.length) {
      setLightboxIndex(filtered.length > 0 ? 0 : null);
    }
  }, [filtered.length, lightboxIndex]);

  const activePhoto =
    lightboxIndex !== null ? filtered[lightboxIndex] : undefined;

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

  const isPayBtn =
    (wo?.status === "STARTED" || wo?.status === "COMPLETED") &&
    wo?.payment?.status === "UNPAID";

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
          {label ?? "My Services"}
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
                  ["ALL", "BEFORE_PHOTO", "AFTER_PHOTO", "SIGNATURE"] as const
                ).map((t) => (
                  <Button
                    key={t}
                    size="sm"
                    variant={tab === t ? "secondary" : "outline"}
                    className={cn(
                      tab === t &&
                        "bg-primary text-primary-foreground hover:bg-primary/90",
                    )}
                    onClick={() => handleTabChange(t)}
                  >
                    {t === "ALL" && "All"}
                    {t === "BEFORE_PHOTO" && "Before"}
                    {t === "AFTER_PHOTO" && "After"}
                    {t === "SIGNATURE" && "Signature"}
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
                    onClick={() => setLightboxIndex(i)}
                    aria-label={`Open image ${i + 1} of ${filtered.length}`}
                    className="group relative aspect-square overflow-hidden rounded-xl border bg-muted"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.url}
                      alt={`${p.type} ${i + 1}`}
                      className="size-full object-cover transition-transform group-hover:scale-105"
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
                    onClick={() => setLightboxIndex(3)}
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

            {/* Image lightbox: full screen */}
            <Dialog
              open={lightboxIndex !== null}
              onOpenChange={(v) => {
                if (!v) closeLightbox();
              }}
            >
              <DialogContent className="flex h-[80vh] max-h-[90vh] w-[80vw] max-w-none flex-col gap-0 overflow-hidden rounded-xl border-0 p-0 sm:max-w-none">
                <DialogHeader className="sr-only">
                  <DialogTitle>
                    Attachment {lightboxIndex !== null ? lightboxIndex + 1 : 0}{" "}
                    of {filtered.length}
                  </DialogTitle>
                </DialogHeader>
                {activePhoto && (
                  <div className="relative flex min-h-0 flex-1 items-center justify-center bg-black">
                    <img
                      key={activePhoto.url}
                      src={activePhoto.url}
                      alt={`${activePhoto.type} ${(lightboxIndex ?? 0) + 1} of ${filtered.length}`}
                      className="h-[90vh] w-full object-contain"
                    />
                    <span className="absolute top-3 left-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium">
                      {(lightboxIndex ?? 0) + 1} / {filtered.length}
                    </span>
                    <span className="absolute top-3 right-14 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-medium capitalize">
                      {activePhoto.type.toLowerCase()}
                    </span>
                    {filtered.length > 1 && (
                      <>
                        <Button
                          type="button"
                          size="icon"
                          variant="secondary"
                          aria-label="Previous image"
                          onClick={goPrev}
                          className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full opacity-90 hover:opacity-100"
                        >
                          <ChevronLeft className="size-5" aria-hidden />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="secondary"
                          aria-label="Next image"
                          onClick={goNext}
                          className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full opacity-90 hover:opacity-100"
                        >
                          <ChevronRight className="size-5" aria-hidden />
                        </Button>
                      </>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between gap-3 bg-background p-3">
                  <p className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
                    {activePhoto?.description || "No description"}
                  </p>
                  {activePhoto && (
                    <a
                      href={activePhoto.url}
                      download
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                      )}
                    >
                      <Download className="size-4" aria-hidden />
                      Download
                    </a>
                  )}
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
            <Section
              title="Payment"
              action={isPayBtn && <PaymentBtn workOrderId={wo?.id} />}
            >
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
