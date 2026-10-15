"use client";

import {
  ArrowLeft,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarClock,
  CircleAlert,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ProfileAvatarUpload } from "@/components/module/profile/profile-avatar-upload";
import {
  formatAddress,
  formatMemberSince,
  maskNid,
} from "@/components/module/profile/profile-helpers";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMe } from "@/hooks";
import { cn } from "@/lib/utils";
import DataNotFoundCard from "@/shared/data-not-found";
import type { ILoggedUser, IManager, IRegion } from "@/types";
import { badgeText, statusVarient } from "@/utils";

const ManagerProfile = () => {
  const { data, isPending, isError } = useGetMe();
  const [showNid, setShowNid] = useState(false);

  if (isPending) {
    return (
      <div className="mx-auto w-full max-w-6xl space-y-4 p-4 sm:p-6">
        <Skeleton className="h-52 rounded-2xl" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="mx-auto max-w-6xl p-4 sm:p-6">
        <DataNotFoundCard
          message="Profile not found"
          description="We could not load your manager profile. Please try again."
        />
      </div>
    );
  }

  const me = data.data as ILoggedUser;
  const mgr: IManager | null | undefined = me.manager;

  const regions: IRegion[] = mgr?.region ?? [];
  const addr: string | null = formatAddress(mgr?.address);
  const memberSince =
    mgr?.createdAt != null && mgr.createdAt !== ""
      ? formatMemberSince(mgr.createdAt)
      : "—";
  const verificationLabel = mgr?.verificationStatus ?? "—";
  const accountStatus = me.status ?? "Active";

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-6xl space-y-4 px-3 py-4 sm:space-y-5 sm:px-6 sm:py-6">
        <div className="flex items-center justify-between px-1 text-sm">
          <Link
            href="/manager-dashboard"
            className="inline-flex items-center gap-1.5 font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-4" />
            Back to dashboard
          </Link>
          <span className="hidden text-xs font-semibold tracking-widest text-muted-foreground uppercase sm:block">
            Profile
          </span>
        </div>

        <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgb(0_0_0/0.04)]">
          <div className="relative h-10 overflow-hidden bg-gradient-to-r from-primary via-primary/85 to-primary/60">
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
                    <Badge
                      variant={statusVarient(accountStatus)}
                      className="rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-none ring-1 ring-border"
                    >
                      <span className="size-1.5 rounded-full bg-current" />
                      {badgeText(accountStatus)}
                    </Badge>
                    {me.emailVerified ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-500/25 dark:text-emerald-400">
                        <BadgeCheck className="size-3.5" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-500/25 dark:text-amber-400">
                        <CircleAlert className="size-3.5" /> Unverified
                      </span>
                    )}
                    {mgr?.verificationStatus ? (
                      <Badge
                        variant={statusVarient(verificationLabel)}
                        className="rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-none ring-1 ring-border"
                      >
                        {badgeText(verificationLabel)}
                      </Badge>
                    ) : null}
                  </div>
                  {addr && (
                    <p className="mt-2 inline-flex max-w-full items-center gap-1.5 text-[13px] text-muted-foreground">
                      <MapPin className="size-3.5 shrink-0 text-primary" />
                      <span className="truncate">{addr}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section aria-label="Manager overview">
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
            <Stat
              icon={<ShieldCheck className="size-4.5" />}
              value={accountStatus}
              label="Account status"
              hint="Current standing"
            />
            <Stat
              icon={<BadgeCheck className="size-4.5" />}
              value={verificationLabel}
              label="Verification"
              hint="Manager approval"
            />
            <Stat
              icon={<MapPin className="size-4.5" />}
              value={String(regions.length)}
              label="Regions"
              hint="Assigned coverage"
            />
            <Stat
              icon={<CalendarClock className="size-4.5" />}
              value={memberSince}
              label="Member since"
              hint="Onboarded date"
            />
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-5 lg:gap-5">
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 md:col-span-3">
            <SectionHeading
              title="Personal information"
              sub="Contact & identity details"
            />
            <div className="mt-3 divide-y divide-border/70">
              <InfoLine
                icon={<UserRound className="size-4" />}
                label="Full name"
                value={me.name ?? "—"}
              />
              <InfoLine
                icon={<Mail className="size-4" />}
                label="Email"
                value={me.email ?? "—"}
              />
              <InfoLine
                icon={<Phone className="size-4" />}
                label="Phone"
                value={mgr?.phone}
              />
              <InfoLine
                icon={<MapPin className="size-4" />}
                label="Address"
                value={addr}
              />
              <div className="flex items-center justify-between gap-3 py-3 last:pb-0">
                <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <ShieldCheck className="size-4" />
                  </span>
                  NID
                </span>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <span className="tracking-widest tabular-nums">
                    {showNid && mgr?.nid ? mgr.nid : maskNid(mgr?.nid)}
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
              title={`Assigned regions · ${regions.length}`}
              sub="Coverage assigned by admin"
            />
            {regions.length === 0 ? (
              <div className="mt-4 rounded-xl border border-dashed border-border bg-muted/40 px-4 py-6 text-center">
                <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
                  No regions assigned yet. Regions assigned by admin will appear
                  here.
                </p>
              </div>
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
                        {r.area ?? `Region ${i + 1}`}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                        Active · {r.description ?? "No description"}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <SectionHeading
            title="Account security"
            sub="Sign-in & verification state"
          />
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Badge
              variant={statusVarient(accountStatus)}
              className="rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-none ring-1 ring-border"
            >
              <span className="size-1.5 rounded-full bg-current" />
              {badgeText(accountStatus)}
            </Badge>
            {me.emailVerified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-500/25 dark:text-emerald-400">
                <BadgeCheck className="size-3.5" /> Email verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-500/25 dark:text-amber-400">
                <CircleAlert className="size-3.5" /> Email unverified
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary ring-1 ring-primary/20">
              <KeyRound className="size-3.5" />
              {me.authProvider === "CREDENTIAL"
                ? "Credential authentication"
                : (me.authProvider ?? "—")}
            </span>
          </div>
          <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarClock className="size-4 text-primary" />
            Member since {memberSince}
          </p>
        </section>
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
      <p className="mt-3 truncate text-lg font-extrabold tracking-tight text-foreground tabular-nums sm:text-xl">
        {value}
      </p>
      <p className="text-[13px] font-semibold text-foreground">{label}</p>
      <p className="truncate text-xs text-muted-foreground">{hint}</p>
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

export default ManagerProfile;
