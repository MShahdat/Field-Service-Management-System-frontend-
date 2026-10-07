"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProfileAvatarUpload } from "./profile-avatar-upload";

export function StatusBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-[13px] font-medium text-primary dark:bg-primary/20">
      {children}
    </span>
  );
}

export function ProfileHeader({
  name,
  email,
  roleLabel,
  imageUrl,
  badges,
  topRight,
  backHref,
}: {
  name: string;
  email: string;
  roleLabel: string;
  imageUrl?: string;
  badges: ReactNode;
  topRight: string;
  backHref: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between px-1 pb-4 text-[14px] text-muted-foreground">
        <Link href={backHref} className="hover:text-foreground">
          ← Back
        </Link>
        <span>{topRight}</span>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <ProfileAvatarUpload name={name} imageUrl={imageUrl} />
          <div className="min-w-0 flex-1">
            <span className="inline-block rounded-full bg-primary px-4 py-1 text-[11px] font-bold tracking-wider text-primary-foreground uppercase">
              {roleLabel}
            </span>
            <h1 className="mt-2 truncate text-[28px] leading-tight font-bold text-card-foreground">
              {name}
            </h1>
            <p className="text-[14px] text-muted-foreground">{email}</p>
            <div className="mt-2 flex flex-wrap gap-2">{badges}</div>
          </div>
          <Button className="sm:ml-auto font-bold">Edit Profile</Button>
        </div>
      </div>
    </div>
  );
}

export function SectionCard({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("rounded-2xl border border-border bg-card p-6", className)}
    >
      <h2 className="text-[12px] font-semibold tracking-widest text-muted-foreground uppercase">
        {title}
      </h2>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export function InfoRow({
  label,
  value,
  muted,
}: {
  label: string;
  value: ReactNode;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/60 py-3 last:border-0">
      <span className="text-[14px] text-muted-foreground">{label}</span>
      <span
        className={cn(
          "text-right text-[14px] font-semibold text-foreground",
          muted && "font-normal text-muted-foreground italic",
        )}
      >
        {value}
      </span>
    </div>
  );
}

export function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-muted p-4">
      <p className="text-[24px] font-bold text-foreground">{value}</p>
      <p className="text-[13px] text-muted-foreground">{label}</p>
    </div>
  );
}

export function RegionCard({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="rounded-xl bg-muted p-4">
      <p className="text-[20px] font-bold text-foreground">{title}</p>
      <p className="text-[13px] text-muted-foreground">{sub}</p>
    </div>
  );
}

export function SkillBadge({
  name,
  category,
}: {
  name: string;
  category?: string;
}) {
  return (
    <div className="rounded-xl bg-muted px-4 py-3">
      <p className="text-[15px] font-bold text-foreground">{name}</p>
      {category && (
        <p className="text-[12px] text-muted-foreground">{category}</p>
      )}
    </div>
  );
}

export function AvailabilityRow({
  day,
  label,
  pct,
}: {
  day: string;
  label: string;
  pct: number;
}) {
  return (
    <div
      className="grid grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-2 border-b border-border/60 py-2.5 text-[13px] last:border-0 sm:grid-cols-[88px_minmax(0,1fr)_auto] sm:gap-4 sm:text-[14px]"
      title={`${day} ${label}`}
    >
      <span className="truncate text-foreground">{day}</span>
      <div
        className="h-2.5 min-w-0 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${day} availability`}
      >
        <div
          className="h-full rounded-full bg-primary transition-[width]"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="shrink-0 text-right whitespace-nowrap text-muted-foreground tabular-nums">
        {label}
      </span>
    </div>
  );
}
