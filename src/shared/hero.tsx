"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetCategories } from "@/hooks";
import { ICategory } from "@/types";
import * as LucideIcons from "lucide-react";
import { LucideIcon, Search, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const MAX_CATEGORIES = 5;

const STATS = [
  { value: "2,000+", label: "Services completed" },
  { value: "4.8", label: "Average rating" },
  { value: "24/7", label: "Dispatch support" },
];

function getIcon(name?: string | null): LucideIcon {
  if (!name) return LucideIcons.Sparkles;
  const Icon = LucideIcons[name as keyof typeof LucideIcons];
  return (Icon as LucideIcon) ?? LucideIcons.Sparkles;
}

const chipClass =
  "inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function CategoryChips() {
  const { data, isPending } = useGetCategories();

  // Reserve the same space while loading so the hero doesn't jump.
  if (isPending) {
    return (
      <div className="mt-6 flex flex-wrap justify-center gap-2" aria-hidden>
        {[88, 104, 96, 112, 92].map((w) => (
          <div
            key={w}
            style={{ width: w }}
            className="h-9 rounded-full bg-muted motion-safe:animate-pulse"
          />
        ))}
      </div>
    );
  }

  // If categories fail or are empty, the hero still works without them.
  const categories: ICategory[] = data?.success
    ? (data.data ?? []).slice(0, MAX_CATEGORIES)
    : [];
  if (categories.length === 0) return null;

  return (
    <nav
      aria-label="Popular services"
      className="mt-6 flex max-w-2xl flex-wrap justify-center gap-2"
    >
      {categories.map((category) => {
        const Icon = getIcon(category.icon);
        return (
          <Link href={"/"} key={category.id} className={chipClass}>
            <Icon className="h-4 w-4 text-primary" aria-hidden />
            {category.name}
          </Link>
        );
      })}
    </nav>
  );
}

export const HeroSection = () => {
  return (
    <section
      className="relative overflow-hidden bg-background text-foreground"
      style={{
        backgroundImage:
          "radial-gradient(circle, color-mix(in oklch, var(--foreground) 9%, transparent) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
    >
      {/* Fade the dot grid out toward the center so text stays readable */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, var(--background) 20%, transparent 85%), radial-gradient(ellipse 60% 50% at 50% 40%, transparent 20%, var(--background) 85%)",
        }}
      />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 py-14 text-center sm:px-6 sm:py-12 md:py-16">
        <Badge
          variant="outline"
          className="mb-6 gap-1.5 rounded-full border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-primary" aria-hidden />
          Verified professionals only
          <span className="ml-1 flex items-center gap-1.5 border-l border-border pl-2 font-medium text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary motion-safe:animate-pulse" />
            Open now
          </span>
        </Badge>

        <h1 className="max-w-3xl text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
          Find trusted home service professionals
        </h1>

        <p className="mt-5 max-w-xl text-balance text-base text-muted-foreground md:text-lg">
          Book verified technicians for any home service, with on-time
          guarantees.
        </p>

        <form
          // role="search"

          className="mt-9 flex w-full max-w-xl items-center gap-2 rounded-2xl border border-border bg-card p-1.5 shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-ring/50"
        >
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              type="search"
              // value={query}
              // onChange={(e) => setQuery(e.target.value)}
              aria-label="Search services"
              placeholder="What service do you need?"
              className="h-11 border-0 bg-transparent pl-10 text-base shadow-none focus-visible:ring-0 sm:text-sm"
            />
          </div>
          <Button type="submit" className="h-11 rounded-xl px-6 font-medium">
            Search
          </Button>
        </form>

        <CategoryChips />

        <dl className="mt-14 grid w-full max-w-2xl grid-cols-3 divide-x divide-border/60 rounded-2xl border border-border/60 bg-card/40 py-6 shadow-sm backdrop-blur-md supports-backdrop-filter:bg-card/30 sm:py-7">
          {STATS.map(({ value, label }) => (
            <div
              key={label}
              className="flex flex-col-reverse items-center gap-1 px-2 sm:px-4"
            >
              <dt className="text-center text-xs leading-tight text-muted-foreground sm:text-sm">
                {label}
              </dt>
              <dd className="text-2xl font-bold tabular-nums sm:text-3xl">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
