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
import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProfileAvater from "@/shared/avater";
import PaymentBtn from "@/shared/payment.btn";
import type { ILoggedUser, IService, UserRole } from "@/types";
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
import { MyServiceModal } from "./cus-service-modal";
import DeleteModal from "./cus-delete-modal";


type Photo = { url: string; type: string; description?: string };

type GalleryTab = "ALL" | "BEFORE_PHOTO" | "AFTER_PHOTO" | "SIGNATURE";

const IMAGE_URL_RE = /\.(png|jpe?g|webp)(\?|#|$)/i;

type Props = {
  service: IService;
  backHref: string;
  role?: UserRole
};

const ServiceDetailsView = ({ service, backHref, role }: Props) => {
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

  console.log('role......', role)

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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

  const isEdit = service.status === "PENDING" || service.status === "REJECTED";

  const isDelete =
    service.status === "PENDING" ||
    service.status === "CANCELLED" ||
    service.status === "REJECTED" ||
    service.status === "COMPLETED";

  return (
    <div className="w-full mx-auto">
      <header className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 items-start gap-3 sm:gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-xl text-primary-foreground shadow-md shadow-primary/25 ring-1 ring-primary/20 sm:size-12">
            {service.category?.icon ? (
              <span aria-hidden>{service.category.icon}</span>
            ) : (
              <Wrench className="size-5" aria-hidden />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
              <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">
                {service.title === "" ? "Service title" : service.title}
              </h1>
              <Badge
                variant={statusVarient(service.status)}
                className="rounded-full ring-1 ring-border"
              >
                <span className="size-1.5 rounded-full bg-current" />
                {badgeText(service.status)}
              </Badge>
              <Badge
                variant={statusVarient(service.priority)}
                className="rounded-full ring-1 ring-border"
              >
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
                "flex-1 rounded-xl font-semibold shadow-sm md:flex-none",
              )}
            >
              <Download className="size-4" />
              Download report
            </a>
          )}
          {(isEdit && role === "CUSTOMER") && <MyServiceModal service={service} mode="edit" />}
          {(isDelete && role === "CUSTOMER") && (
            <DeleteModal service={service} redirectOnDelete={backHref} />
          )}
        </div>
      </header>

      {/* description */}
      <Section title="Description" className="mb-4 rounded-2xl">
        <p className="text-sm leading-relaxed text-foreground/90">
          {service.description?.trim()
            ? service.description
            : "No description provided."}
        </p>
      </Section>

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
              <div className="flex items-center gap-1.5 text-destructive">
                <AlertCircle className="size-4" />
                <p className="text-sm font-medium">No payment yet</p>
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
          <Section title="Service progress" className="rounded-2xl">
            <Timeline events={events} />
          </Section>

          <Section
            className="rounded-2xl"
            title={
              <>
                Attachments{" "}
                <span className="font-normal text-muted-foreground">
                  ({photos.length})
                </span>
              </>
            }
            action={
              <div className="flex flex-wrap gap-1.5">
                {(
                  ["ALL", "BEFORE_PHOTO", "AFTER_PHOTO", "SIGNATURE"] as const
                ).map((t) => (
                  <Button
                    key={t}
                    size="sm"
                    variant={tab === t ? "secondary" : "outline"}
                    className={cn(
                      "rounded-xl font-semibold",
                      tab === t &&
                      "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
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
              <div className="rounded-xl border border-dashed border-border bg-muted/40 px-4 py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No {tab.toLowerCase()} photos yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {preview.map((p, i) => (
                  <button
                    key={`${p.url}-${i}`}
                    type="button"
                    onClick={() => setLightboxIndex(i)}
                    aria-label={`Open image ${i + 1} of ${filtered.length}`}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-muted transition-all hover:border-primary/40 hover:shadow-md hover:ring-2 hover:ring-primary/20"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.url}
                      alt={`${p.type} ${i + 1}`}
                      className="size-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute bottom-2 left-2 rounded-full bg-primary/90 px-2 py-0.5 text-[11px] font-semibold text-primary-foreground capitalize shadow-sm">
                      {p.type.toLowerCase()}
                    </span>
                  </button>
                ))}
                {overflowCount > 0 || filtered.length > 3 ? (
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(3)}
                    className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-primary/30 bg-primary/[0.04] text-sm transition-colors hover:bg-primary/[0.08]"
                  >
                    <span className="text-2xl font-extrabold text-primary tabular-nums">
                      +{overflowCount}
                    </span>
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
                    <span className="absolute top-3 left-3 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground tabular-nums shadow-sm">
                      {(lightboxIndex ?? 0) + 1} / {filtered.length}
                    </span>
                    <span className="absolute top-3 right-14 rounded-full bg-primary/90 px-2.5 py-1 text-[11px] font-semibold text-primary-foreground capitalize shadow-sm">
                      {activePhoto.type.toLowerCase()}
                    </span>
                    {filtered.length > 1 && (
                      <div>
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
                      </div>
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
                        "rounded-xl font-semibold shadow-sm",
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
              <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-muted/40 p-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
                    <FileText className="size-5" aria-hidden />
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
                    "shrink-0 rounded-xl font-semibold shadow-sm",
                  )}
                >
                  <Eye className="size-4" /> View
                </a>
              </div>
            )}
          </Section>

          {feedback && (
            <Section className="rounded-2xl border-amber-500/25 bg-amber-500/[0.04] ring-1 ring-amber-500/20">
              <div className="flex items-center gap-4">
                <p className="text-4xl font-extrabold tracking-tight text-foreground tabular-nums">
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
              className="rounded-2xl"
              action={isPayBtn && <PaymentBtn workOrderId={wo?.id} />}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="truncate text-2xl font-extrabold tracking-tight tabular-nums">
                  {formatMoney(payment?.amount)}
                </p>
                {payment && (
                  <Badge
                    variant={
                      payment.status === "PAID" ? "accepted" : "requested"
                    }
                    className="shrink-0 rounded-full ring-1 ring-border"
                  >
                    <span className="size-1.5 rounded-full bg-current" />
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

          <Section title="People" className="rounded-2xl">
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/40 p-3 transition-colors hover:border-primary/25">
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

              <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-muted/40 p-3 transition-colors hover:border-primary/25">
                <ProfileAvater
                  name={technician?.user.name ?? "-"}
                  imageUrl={technician?.user.profileImg ?? ""}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold">
                      {technician?.user?.name ?? "Not assigned"}
                    </p>
                    {technician && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-500/25 dark:text-emerald-400">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        Available
                      </span>
                    )}
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
                <div className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-muted/40 p-3 transition-colors hover:border-primary/25">
                  <div className="flex min-w-0 items-center gap-3">
                    <ProfileAvater
                      name={manager.user.name}
                      imageUrl={manager.user.profileImg}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {manager?.user?.name ?? "-"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Manager · approved
                      </p>
                    </div>
                  </div>
                  <ImageIcon
                    className="size-4 shrink-0 text-primary"
                    aria-hidden
                  />
                </div>
              )}
            </div>
          </Section>

          <Section title="Service info" className="rounded-2xl">
            <InfoRow label="Region" value={region.area ?? "-"} />
            <InfoRow
              label="Work order"
              value={
                <span className="font-mono">
                  {wo?.id ? (
                    `#${wo?.id?.slice(0, 8).toUpperCase()}`
                  ) : (
                    <span className="font-sans text-sm font-medium text-destructive">
                      Not ordered
                    </span>
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
