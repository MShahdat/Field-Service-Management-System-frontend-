"use client";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCategories, useGetPublicStats } from "@/hooks";
import { cn } from "@/lib/utils";
import { ICategory, PublicAnalytics } from "@/types";
import * as LucideIcons from "lucide-react";
import { ArrowRight, LucideIcon, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { ServiceFlowAnimation } from "./hero-animation";

const MAX_CATEGORIES = 5;

function getIcon(name?: string | null): LucideIcon {
  if (!name) return LucideIcons.Sparkles;
  const Icon = LucideIcons[name as keyof typeof LucideIcons];
  return (Icon as LucideIcon) ?? LucideIcons.Sparkles;
}

const CategoryChips = () => {
  const { data, isPending } = useGetCategories();

  if (isPending) {
    return (
      <div className="flex flex-wrap gap-2" aria-hidden>
        {[88, 104, 96, 112, 92].map((w) => (
          <div
            key={w}
            style={{ width: w }}
            className="h-8 rounded-full bg-muted motion-safe:animate-pulse"
          />
        ))}
      </div>
    );
  }

  const categories: ICategory[] = data?.success
    ? (data.data ?? []).slice(0, MAX_CATEGORIES)
    : [];
  if (categories.length === 0) return null;

  return (
    <nav aria-label="Popular services" className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const Icon = getIcon(category.icon);
        return (
          <Link
            key={category.id}
            href={`/services?category=${category.id}`}
            className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Icon className="size-4 text-primary" aria-hidden />
            {category.name}
          </Link>
        );
      })}
    </nav>
  );
};

const Stats = () => {
  const { data, isPending } = useGetPublicStats();

  if (isPending) {
    return (
      <div className="grid max-w-md grid-cols-3 gap-6" aria-hidden>
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  const analytics: Partial<PublicAnalytics> = data?.data ?? {};
  const rating = Number(analytics.totalAvgRating ?? 0);

  const items = [
    {
      value: `${(analytics.totalCompletedServices ?? 0).toLocaleString()}+`,
      label: "Services completed",
    },
    { value: `${rating.toFixed(2)}/5`, label: "Average rating" },
    { value: "24/7", label: "Dispatch support" },
  ];

  return (
    <dl className="grid max-w-md grid-cols-3 divide-x divide-border">
      {items.map(({ value, label }) => (
        <div
          key={label}
          className="flex flex-col-reverse gap-1 px-4 first:pl-0 last:pr-0 sm:px-6"
        >
          <dt className="text-xs leading-tight text-muted-foreground">
            {label}
          </dt>
          <dd className="text-xl font-semibold tabular-nums tracking-tight">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
};

export const HeroSection = () => {
  return (
    // Fills the viewport under the header. Change 4rem to your header height.
    <section className="relative flex overflow-hidden bg-background text-foreground lg:min-h-[calc(100svh-4rem)]">
      {/* One soft glow behind the animation */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/2 size-[32rem] -translate-y-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklch, var(--primary) 12%, transparent), transparent 70%)",
        }}
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:py-8">
        {/* Left: content */}
        <div className="flex flex-col items-start gap-6 text-left">
          <div className="flex flex-col items-start gap-4">
            <Badge
              variant="outline"
              className="gap-1.5 rounded-full border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground"
            >
              <ShieldCheck className="size-3.5 text-primary" aria-hidden />
              Verified professionals only
            </Badge>

            <h1 className="max-w-2xl text-balance text-3xl font-bold leading-[1.12] tracking-tight sm:text-4xl xl:text-5xl">
              Find trusted home service professionals
            </h1>

            <p className="max-w-lg text-base leading-relaxed text-muted-foreground">
              Book verified technicians for any home service, with on-time
              guarantees and updates from request to payment.
            </p>
          </div>

          {/* TODO: point these at your real routes */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/services"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-8 gap-2 rounded-xl px-6 text-sm font-medium",
              )}
            >
              Book a service
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href="/#how-it-works"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-8 rounded-xl px-6 text-sm font-medium",
              )}
            >
              How it works
            </Link>
          </div>

          <CategoryChips />

          <div className="w-full border-t border-border pt-6">
            <Stats />
          </div>
        </div>

        {/* Right: animation, sized so it never exceeds the viewport height */}
        <div className="flex items-center justify-center">
          <ServiceFlowAnimation className="w-[min(100%,30rem,calc(100svh-9rem))]" />
        </div>
      </div>
    </section>
  );
};