'use client'

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetCategories } from "@/hooks";
import { ICategory } from "@/types";
import { LucideIcon, Search, ShieldCheck } from "lucide-react";
import * as LucideIcons from 'lucide-react';

const STATS = [
  { value: '2,000+', label: 'Service completed' },
  { value: '4.8', label: 'Average rating' },
  { value: '24/7', label: 'Dispatch support' },
];

function getIcon(name?: string | null): LucideIcon {
  if (!name) return LucideIcons.Sparkles;
  const Icon = LucideIcons[name as keyof typeof LucideIcons];
  return (Icon as LucideIcon) ?? LucideIcons.Sparkles;
}

export const HeroSection = () => {

  const {data} = useGetCategories()

  if(!data?.success){
    return
  }

  const categoryItems = data?.data ?? []

  const visibleCategories = categoryItems.slice(0, 5);

  return (
    <section
      className="relative overflow-hidden bg-background text-foreground"
      style={{
        backgroundImage:
          'radial-gradient(circle, color-mix(in oklch, var(--foreground) 9%, transparent) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 40%, transparent 20%, var(--background) 85%)',
        }}
      />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-12 md:py-18 flex flex-col items-center text-center">
        <Badge
          variant="outline"
          className="mb-6 gap-1.5 rounded-full border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          Verified professionals only
          <span className="ml-1 flex items-center gap-1 border-l border-border pl-1.5 font-mono text-[10px] uppercase tracking-wide text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Open now
          </span>
        </Badge>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] text-balance max-w-3xl">
          Find trusted home service professionals
        </h1>

        <p className="mt-4 sm:mt-5 text-base md:text-lg text-muted-foreground max-w-xl text-center">
          Book verified technicians for any home service and on-time guarantees.
        </p>

        <div className="mt-8 sm:mt-9 flex w-full max-w-xl flex-col sm:flex-row items-stretch gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="What service do you need?"
              className="h-9 sm:h-10 pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground rounded-xl focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <Button
            // onClick={handleSearch}
            className="h-9 sm:h-10 px-6 sm:px-7 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
          >
            Search
          </Button>
        </div>

        {categoryItems.length > 0 && (
          <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-2xl">
            {visibleCategories.map((category: ICategory) => {
              const Icon = getIcon(category.icon);
              return (
                <Badge
                  key={category.id}
                  variant="secondary"
                  className="gap-1.5 rounded-full border border-border bg-foreground px-3 py-1.5 text-xs font-medium text-background transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {category.name}
                </Badge>
              );
            })}
          </div>
        )}

        <div className="mt-12 sm:mt-14 w-full max-w-2xl rounded-2xl border border-border/60 bg-card/40 backdrop-blur-md shadow-sm supports-backdrop-filter:bg-card/30">
          <div className="grid grid-cols-3 divide-x divide-border/50 px-2 py-6 sm:px-4 sm:py-7">
            {STATS.map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center px-2">
                <span className="text-xl sm:text-2xl md:text-3xl font-bold tabular-nums">
                  {value}
                </span>
                <span className="mt-1 text-xs sm:text-sm text-muted-foreground text-center leading-tight">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};