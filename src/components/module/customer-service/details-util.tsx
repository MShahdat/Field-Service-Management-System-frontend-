"use client";

import { cn } from "cn";
import { Check, Copy, Star } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";

export const TZ = "Asia/Dhaka";

export interface TimelineEvent {
  key: string;
  label: string;
  at: string | null;
  detail?: string;
}

export function CopyId({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // noop
    }
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
      <span className="font-mono">#{value.slice(0, 8).toUpperCase()}</span>
      <span aria-hidden>·</span>
      <button
        type="button"
        onClick={copy}
        aria-label="Copy service ID"
        className="inline-flex items-center rounded-sm transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        {copied ? (
          <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <Copy className="size-3.5" />
        )}
      </button>
    </span>
  );
}

export function SummaryCard({
  icon: Icon,
  label,
  value,
  sub,
  badge,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  badge?: React.ReactNode;
}) {
  return (
    <Card className="gap-0 px-4 py-3.5 shadow-none">
      <p className="mb-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="size-3.5" aria-hidden />
        {label}
      </p>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <p className="text-sm font-semibold sm:text-base">{value}</p>
        {badge}
      </div>
      {sub && (
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{sub}</p>
      )}
    </Card>
  );
}

export function Section({
  title,
  action,
  children,
  className,
}: {
  title?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("gap-0 py-0 shadow-none", className)}>
      {(title || action) && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-4 sm:px-5 sm:pt-5">
          {title && <h2 className="text-base font-semibold">{title}</h2>}
          {action}
        </div>
      )}
      <div className="p-4 sm:p-5 [&:not(:first-child)]:pt-3">{children}</div>
    </Card>
  );
}

const dateFmt = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  month: "short",
  day: "numeric",
  year: "numeric",
});

const dateTimeFmt = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const timeFmt = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  hour: "numeric",
  minute: "2-digit",
});

export function formatServiceDate(iso?: string | null) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return dateFmt.format(d);
}

// "12:00" | "14:00:00" | ISO -> "2:00 PM"
export function formatClock(t?: string | null) {
  if (!t) return "-";
  if (t.includes("T")) {
    const d = new Date(t);
    if (!Number.isNaN(d.getTime())) return timeFmt.format(d);
    return t;
  }
  const [hh, mm] = t.split(":");
  const h = Number(hh);
  if (Number.isNaN(h)) return t;
  const d = new Date();
  d.setHours(h, Number(mm ?? "0"), 0, 0);
  return timeFmt.format(d);
}

export function formatDateTime(iso?: string | null) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return dateTimeFmt.format(d);
}

// "1999" | "1999.00" => "৳1,999"
export function formatMoney(amount?: string | number | null) {
  if (amount === null || amount === undefined || amount === "") return "-";
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  if (Number.isNaN(n)) return `${amount}`;
  return `৳${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function Timeline({ events }: { events: TimelineEvent[] }) {
  const visible = events.filter((e) => e.at);
  if (visible.length === 0) {
    return (
      <p className="py-2 text-sm text-muted-foreground">No progress yet.</p>
    );
  }
  return (
    <ol>
      {visible.map((e, i) => (
        <li key={e.key} className="relative flex gap-3 pb-5 last:pb-0">
          {i < visible.length - 1 && (
            <span
              aria-hidden
              className="absolute top-7 bottom-0 left-3 w-px -translate-x-1/2 bg-border"
            />
          )}
          <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-green-500/15 text-green-600 dark:bg-green-500/20 dark:text-green-400">
            <Check className="size-3.5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold">{e.label}</p>
            <p className="text-xs text-muted-foreground">
              {formatDateTime(e.at)}
              {e.detail ? ` · ${e.detail}` : ""}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function InfoRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b py-2.5 text-sm last:border-0 last:pb-0 first:pt-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

const STAR_POSITIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export function Stars({ value, max = 5 }: { value: number; max?: number }) {
  const rounded = Math.round(value);
  return (
    <span
      role="img"
      className="inline-flex items-center gap-0.5"
      aria-label={`${value} out of ${max}`}
    >
      {STAR_POSITIONS.slice(0, max).map((position) => (
        <Star
          key={`star-${position}`}
          className={cn(
            "size-3.5",
            position < rounded
              ? "fill-amber-500 text-amber-500"
              : "fill-muted text-muted",
          )}
        />
      ))}
    </span>
  );
}

export function getInitials(name?: string | null) {
  if (!name) return "–";
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold leading-snug">{value}</p>
      </div>
    </div>
  );
}

export function getTimeRange(start?: string | null, duration?: number | null) {
  if (!start) return "-";
  const [h, m] = start.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return start;

  const fmt = (totalMin: number) => {
    const mins = ((totalMin % 1440) + 1440) % 1440;
    const hh = Math.floor(mins / 60);
    const mm = String(mins % 60).padStart(2, "0");
    return `${hh % 12 || 12}:${mm} ${hh >= 12 ? "PM" : "AM"}`;
  };

  const startMin = h * 60 + m;
  return duration
    ? `${fmt(startMin)} – ${fmt(startMin + duration)}`
    : fmt(startMin);
}
