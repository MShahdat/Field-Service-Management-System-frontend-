"use client";
import { format } from "date-fns";
import { CalendarDays, LayoutDashboard } from "lucide-react";
import { useGetMe } from "@/hooks";

export function OverviewHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const { data } = useGetMe();
  const user = (data as any)?.data;
  const firstName = user?.name?.split(" ")[0];

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgb(0_0_0/0.04)]">
      <div className="relative h-10 overflow-hidden bg-gradient-to-r from-primary via-primary/85 to-primary/60 ">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-16 -right-8 size-52 rounded-full bg-white/15 blur-3xl" />
          <div className="absolute -bottom-20 left-1/4 size-48 rounded-full bg-black/15 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.22)_1px,transparent_0)] bg-[size:18px_18px] opacity-60" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/20" />
      </div>
      <div className="flex flex-col gap-3 px-4 pt-4 pb-5 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold tracking-widest text-primary uppercase ring-1 ring-primary/20">
            <LayoutDashboard className="size-3.5" />
            {title}
          </span>
          <h1 className="mt-2 truncate text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
            {firstName ? `Welcome back, ${firstName}` : title}
          </h1>
          <p className="mt-0.5 truncate text-sm text-muted-foreground">
            {subtitle}
          </p>
        </div>
        <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground ring-1 ring-border">
          <CalendarDays className="size-3.5 text-primary" />
          {format(new Date(), "EEEE, MMM d yyyy")}
        </span>
      </div>
    </section>
  );
}
