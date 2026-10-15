"use client";

import {
  ArrowLeft,
  BadgeCheck,
  CircleAlert,
  Eye,
  EyeOff,
  Fingerprint,
  KeyRound,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { formatDateTime } from "@/components/module/customer-service/details-util";
import { ProfileAvatarUpload } from "@/components/module/profile/profile-avatar-upload";
import {
  formatAddress,
  formatTimeDhaka,
} from "@/components/module/profile/profile-helpers";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMe } from "@/hooks";
import { cn } from "@/lib/utils";
import DataNotFoundCard from "@/shared/data-not-found";
import type { ICustomer, ILoggedUser } from "@/types";
import { badgeText, statusVarient } from "@/utils";

const CustomerProfile = () => {
  const [showCustomerId, setShowCustomerId] = useState(false);
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
          description="We could not load your customer profile. Please try again."
        />
      </div>
    );
  }

  const me = data.data as ILoggedUser;
  const cust: ICustomer | null | undefined = me.customer;
  const customerId = cust?.id ?? me.id;

  const phone: string | null = cust?.phone ?? null;
  const addr: string | null = formatAddress(cust?.address);

  const emailStatus = me.emailVerified ? "Verified" : "Unverified";
  const authLabel =
    me.authProvider === "CREDENTIAL" ? "Credential" : (me.authProvider ?? "—");
  const accountStatus = me.status ?? "Active";

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-6xl space-y-4 px-3 py-4 sm:space-y-5 sm:px-6 sm:py-6">
        {/* Top bar */}
        <div className="flex items-center justify-between px-1 text-sm">
          <Link
            href="/customer-dashboard"
            className="inline-flex items-center gap-1.5 font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-4" />
            Back to dashboard
          </Link>
          <span className="hidden text-xs font-semibold tracking-widest text-muted-foreground uppercase sm:block">
            My Profile
          </span>
        </div>

        {/* Hero header card */}
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
                        <BadgeCheck className="size-3.5" /> Email verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-500/25 dark:text-amber-400">
                        <CircleAlert className="size-3.5" /> Email unverified
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
            </div>
          </div>
        </section>

        {/* Account stats */}
        <section aria-label="Account overview">
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
            <Stat
              icon={<ShieldCheck className="size-4.5" />}
              value={accountStatus}
              label="Account status"
              hint="Current standing"
            />
            <Stat
              icon={<Mail className="size-4.5" />}
              value={emailStatus}
              label="Email"
              hint="Verification state"
            />
            <Stat
              icon={<KeyRound className="size-4.5" />}
              value={authLabel}
              label="Authentication"
              hint="Sign-in method"
            />
            <Stat
              icon={<BadgeCheck className="size-4.5" />}
              value={formatDateTime(me.createdAt)}
              label="Member since"
              hint={formatTimeDhaka(me.createdAt)}
            />
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-5 lg:gap-5">
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 md:col-span-3">
            <SectionHeading
              title="Personal information"
              sub="How we reach you for bookings"
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
                value={phone}
              />
              <InfoLine
                icon={<MapPin className="size-4" />}
                label="Address"
                value={addr}
              />
            </div>
            {(!phone || !addr) && (
              <div className="mt-4 rounded-xl border border-primary/25 bg-primary/[0.06] px-4 py-3 text-[13px] leading-relaxed text-muted-foreground dark:bg-primary/10">
                Add your phone and address so we can reach you for bookings.
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 md:col-span-2">
            <SectionHeading
              title="Account"
              sub="Identity & verification details"
            />
            <div className="mt-3 divide-y divide-border/70">
              <InfoLine
                icon={<ShieldCheck className="size-4" />}
                label="Status"
                value={accountStatus}
              />
              <InfoLine
                icon={<Mail className="size-4" />}
                label="Email"
                value={emailStatus}
              />
              <InfoLine
                icon={<KeyRound className="size-4" />}
                label="Auth"
                value={authLabel}
              />
              <div className="flex items-center justify-between gap-3 py-3 last:pb-0">
                <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Fingerprint className="size-4" />
                  </span>
                  Customer ID
                </span>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <span className="max-w-36 truncate tracking-wider tabular-nums sm:max-w-44">
                    {customerId
                      ? showCustomerId
                        ? customerId
                        : "••••••••"
                      : "—"}
                  </span>
                  {customerId && (
                    <button
                      type="button"
                      onClick={() => setShowCustomerId((visible) => !visible)}
                      aria-label={
                        showCustomerId ? "Hide customer ID" : "Show customer ID"
                      }
                      aria-pressed={showCustomerId}
                      title={
                        showCustomerId ? "Hide customer ID" : "Show customer ID"
                      }
                      className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-primary/10 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      {showCustomerId ? (
                        <EyeOff className="size-4" aria-hidden="true" />
                      ) : (
                        <Eye className="size-4" aria-hidden="true" />
                      )}
                    </button>
                  )}
                </span>
              </div>
            </div>
          </section>
        </div>
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

export default CustomerProfile;
