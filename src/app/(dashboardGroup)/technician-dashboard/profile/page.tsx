"use client";

import {
  ArrowLeft,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarClock,
  CircleAlert,
  Eye,
  EyeOff,
  MapPin,
  PencilLine,
  Phone,
  ShieldCheck,
  Star,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { formatClock } from "@/components/module/services/details-util";
import { ProfileAvatarUpload } from "@/components/module/profile/profile-avatar-upload";
import {
  formatAddress,
  maskNid,
  type NormalizedAvailability,
  normalizeAvailability,
} from "@/components/module/profile/profile-helpers";
import { TechnicianProfileModal } from "@/components/module/profile/technician-profile-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMe } from "@/hooks";
import { cn } from "@/lib/utils";
import DataNotFoundCard from "@/shared/data-not-found";
import type { ILoggedUser, IRegion, ISkills } from "@/types";
import type { ITechnician } from "@/types/technician.types";
import { badgeText, statusVarient } from "@/utils";

const TechnicianProfile = () => {
  const [editOpen, setEditOpen] = useState(false);
  const [showNid, setShowNid] = useState(false);
  const { data, isPending, isError } = useGetMe();

  if (isPending) {
    return (
      <div className="mx-auto w-full max-w-6xl space-y-4 p-4 sm:p-6">
        <Skeleton className="h-52 rounded-2xl" />
        <div className="grid gap-4 md:grid-cols-4">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
        <Skeleton className="h-56 rounded-2xl" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="mx-auto max-w-6xl p-4 sm:p-6">
        <DataNotFoundCard
          message="Profile not found"
          description="We could not load your technician profile. Please try again."
        />
      </div>
    );
  }

  const me = data.data as ILoggedUser;
  const tech: ITechnician | null | undefined = me.technician;

  const regions: IRegion[] = tech?.regions ?? [];
  const skills: ISkills[] = tech?.skills ?? [];
  const availability: NormalizedAvailability[] = normalizeAvailability(
    tech?.availability ?? [],
  );

  const statusLabel: string | undefined = tech?.status;
  const addr: string | null = formatAddress(tech?.address);
  const incomplete = !tech?.isProfileCompleted;
  const completed = tech?.isProfileCompleted;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-6xl space-y-4 px-3 py-4 sm:space-y-5 sm:px-6 sm:py-6">
        {/* Top bar */}
        <div className="flex items-center justify-between px-1 text-sm">
          <Link
            href="/technician-dashboard"
            className="inline-flex items-center gap-1.5 font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-4" />
            Back to dashboard
          </Link>
          <span className="hidden text-xs font-semibold tracking-widest text-muted-foreground uppercase sm:block">
            Technician Profile
          </span>
        </div>

        {/* Hero header card */}
        <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgb(0_0_0/0.04)]">
          <div className="relative h-10 overflow-hidden bg-gradient-to-r from-primary via-primary/85 to-primary/60 sm:h-10">
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div className="absolute -top-20 -right-10 size-64 rounded-full bg-white/15 blur-3xl" />
              <div className="absolute -bottom-24 left-1/4 size-56 rounded-full bg-black/15 blur-3xl" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.22)_1px,transparent_0)] bg-[size:18px_18px] opacity-60" />
            </div>
            <div className="absolute inset-x-0 bottom-0 h-px bg-white/20" />
          </div>

          <div className="px-4 pb-5 sm:px-8 sm:pb-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="relative z-10 -mt-10 w-fit shrink-0 rounded-full bg-background p-1.5 shadow-lg ring-1 ring-border sm:-mt-12">
                  <ProfileAvatarUpload
                    name={me.name ?? "—"}
                    imageUrl={me.profileImg}
                  />
                </div>
                <div className="min-w-0 pb-0.5">
                  <h1 className="mt-2 truncate text-xl font-extrabold tracking-tight text-foreground sm:text-[26px]">
                    {me.name ?? "—"}
                  </h1>
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">
                    {me.email ?? "—"}
                  </p>
                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                    {statusLabel ? (
                      <Badge
                        variant={statusVarient(statusLabel)}
                        className="rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-none ring-1 ring-border"
                      >
                        <span className="size-1.5 rounded-full bg-current" />
                        {badgeText(statusLabel)}
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="rounded-full px-2.5 py-1 text-[11px] ring-1 ring-border"
                      >
                        No status
                      </Badge>
                    )}
                    {completed ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-500/25 dark:text-emerald-400">
                        <BadgeCheck className="size-3.5" /> Profile completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-500/25 dark:text-amber-400">
                        <CircleAlert className="size-3.5" /> Profile incomplete
                      </span>
                    )}
                  </div>
                  {addr && (
                    <p className="mt-2 inline-flex max-w-full items-center gap-1.5 text-[13px] text-muted-foreground">
                      <MapPin className="size-3.5 shrink-0 text-primary" />
                      <span className="truncate">{addr}</span>
                    </p>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col lg:items-end">
                <Button
                  onClick={() => setEditOpen(true)}
                  className="w-full gap-2 rounded-xl px-5 font-semibold shadow-sm sm:w-auto"
                >
                  <PencilLine className="size-4" />
                  {completed ? "Edit profile" : "Complete profile"}
                </Button>
                <p className="hidden text-xs text-muted-foreground lg:block">
                  Keep your info updated to stay eligible
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Incomplete notice */}
        {incomplete && (
          <div className="flex flex-col gap-3 rounded-2xl border border-primary/25 bg-primary/[0.06] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 dark:bg-primary/10">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <CircleAlert className="size-4.5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Complete your profile to get jobs
                </p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">
                  You are{" "}
                  <span className="font-semibold text-foreground">
                    not eligible
                  </span>{" "}
                  for services until phone, NID, bio, address, region, skill and
                  availability are set.
                </p>
              </div>
            </div>
            <Button
              onClick={() => setEditOpen(true)}
              size="sm"
              className="shrink-0 rounded-xl font-semibold"
            >
              Complete now
            </Button>
          </div>
        )}

        {/* Performance stats */}
        <section aria-label="Performance">
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
            <Stat
              icon={<Star className="size-4.5" />}
              value={tech?.rating != null ? String(tech.rating) : "—"}
              label="Rating"
              hint="Avg. customer score"
            />
            <Stat
              icon={<BriefcaseBusiness className="size-4.5" />}
              value={
                tech?.jobsCompleted != null ? String(tech.jobsCompleted) : "—"
              }
              label="Jobs done"
              hint="Completed works"
            />
            <Stat
              icon={<ShieldCheck className="size-4.5" />}
              value={statusLabel ? badgeText(statusLabel) : "—"}
              label="Status"
              hint="Current standing"
            />
            <Stat
              icon={<MapPin className="size-4.5" />}
              value={String(regions.length)}
              label="Regions"
              hint="Service coverage"
            />
          </div>
        </section>

        {/* Professional + regions */}
        <div className="grid gap-4 md:grid-cols-5 lg:gap-5">
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 md:col-span-3">
            <SectionHeading
              title="Professional information"
              sub="Your public contact & identity details"
            />
            <div className="mt-3 divide-y divide-border/70">
              <div className="py-3 first:pt-1 last:pb-0">
                <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Bio
                </p>
                <p
                  className={cn(
                    "mt-1 text-sm leading-relaxed",
                    tech?.bio
                      ? "text-foreground"
                      : "text-muted-foreground italic",
                  )}
                >
                  {tech?.bio ?? "Not added yet"}
                </p>
              </div>
              <InfoLine
                icon={<Phone className="size-4" />}
                label="Phone"
                value={tech?.phone}
              />
              <InfoLine
                icon={<MapPin className="size-4" />}
                label="Address"
                value={addr}
              />
              <div className="flex items-center justify-between gap-3 py-3 last:pb-0">
                <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <ShieldCheck className="size-4" />
                  </span>
                  NID
                </span>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <span className="tracking-widest tabular-nums">
                    {showNid && tech?.nid ? tech.nid : maskNid(tech?.nid)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowNid((v) => !v)}
                    aria-label={showNid ? "Hide NID" : "Show NID"}
                    aria-pressed={showNid}
                    title={showNid ? "Hide NID" : "Show NID"}
                    className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-primary/10 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {showNid ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 md:col-span-2">
            <SectionHeading
              title={`Service regions · ${regions.length}`}
              sub="Areas you can take jobs in"
            />
            {regions.length === 0 ? (
              <EmptyState text="No regions assigned yet. Add them to become eligible for services." />
            ) : (
              <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2">
                {regions.map((r: IRegion, i: number) => (
                  <li
                    key={r.id ?? i}
                    className="group flex items-center gap-3 rounded-xl border border-border/80 bg-muted/50 p-3 transition-colors hover:border-primary/30 hover:bg-primary/[0.05]"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                      <MapPin className="size-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold text-foreground">
                        {r.area ?? "—"}
                      </span>
                      <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide text-emerald-600 uppercase dark:text-emerald-400">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Skills */}
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <SectionHeading
            title={`Skills · ${skills.length}`}
            sub="What customers hire you for"
          />
          {skills.length === 0 ? (
            <EmptyState text="No skills added yet. Add them to become eligible for services." />
          ) : (
            <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              {skills.map((s: ISkills) => (
                <li
                  key={s.id ?? s.name}
                  className="flex items-center gap-3 rounded-xl border border-border/80 bg-muted/50 p-3.5 transition-colors hover:border-primary/30 hover:bg-primary/[0.05]"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
                    <Wrench className="size-4.5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-foreground">
                      {s.name}
                    </span>
                    {s.category?.name && (
                      <span className="block truncate text-xs text-muted-foreground">
                        {s.category.name}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Availability */}
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <SectionHeading
              title={`Weekly availability · ${availability.length} day${availability.length === 1 ? "" : "s"}`}
              sub="Hours shown in Asia/Dhaka time"
            />
            {availability.length > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-primary/20">
                <CalendarClock className="size-3.5" />
                Asia/Dhaka
              </span>
            )}
          </div>
          {availability.length === 0 ? (
            <EmptyState text="Availability not set yet. Your weekly schedule (Asia/Dhaka) will appear here once availability is added." />
          ) : (
            <div className="mt-2">
              <p className="pb-1 text-xs text-muted-foreground">
                e.g. first slot{" "}
                {formatClock(tech?.availability?.[0]?.startTime)} –{" "}
                {formatClock(tech?.availability?.[0]?.endTime)}
              </p>
              <ul className="divide-y divide-border/70">
                {availability.map((a: NormalizedAvailability) => (
                  <li
                    key={a.key}
                    className="grid grid-cols-[72px_minmax(0,1fr)_auto] items-center gap-2 py-2.5 text-[13px] sm:grid-cols-[110px_minmax(0,1fr)_auto] sm:gap-4 sm:text-sm"
                    title={`${a.day} ${a.label}`}
                  >
                    <span className="truncate font-semibold text-foreground">
                      {a.day}
                    </span>
                    <div
                      className="h-2 min-w-0 overflow-hidden rounded-full bg-muted"
                      role="progressbar"
                      aria-valuenow={a.pct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${a.day} availability`}
                    >
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary/70 to-primary transition-[width]"
                        style={{ width: `${a.pct}%` }}
                      />
                    </div>
                    <span className="shrink-0 rounded-md bg-muted/70 px-2 py-1 text-right text-xs font-medium whitespace-nowrap text-muted-foreground tabular-nums sm:text-[13px]">
                      {a.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {editOpen && (
          <TechnicianProfileModal
            open={editOpen}
            onOpenChange={setEditOpen}
            tech={tech}
          />
        )}
      </div>
    </div>
  );
};

function SectionHeading({ title, sub }: { title: string; sub?: string }) {
  return (
    <div>
      <h2 className="text-xs font-bold tracking-widest text-foreground uppercase">
        <span className="mr-2 inline-block h-3.5 w-1 rounded-full bg-primary align-middle" />
        {title}
      </h2>
      {sub && (
        <p className="mt-1 pl-3 text-[13px] text-muted-foreground">{sub}</p>
      )}
    </div>
  );
}

function Stat({
  icon,
  value,
  label,
  hint,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  hint: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/30 sm:p-5">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-primary/30" />
      <div className="flex items-center justify-between gap-2">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
          {icon}
        </span>
      </div>
      <p className="mt-3 truncate text-2xl font-extrabold tracking-tight text-foreground tabular-nums">
        {value}
      </p>
      <p className="text-[13px] font-semibold text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function InfoLine({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 last:pb-0">
      <span className="inline-flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </span>
        {label}
      </span>
      <span
        className={cn(
          "truncate text-right text-sm font-semibold text-foreground",
          !value && "font-normal text-muted-foreground italic",
        )}
        title={value ?? undefined}
      >
        {value ?? "Not added yet"}
      </span>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="mt-4 rounded-xl border border-dashed border-border bg-muted/40 px-4 py-6 text-center">
      <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
        {text}
      </p>
    </div>
  );
}

export default TechnicianProfile;
