"use client";

import {
  ArrowRight,
  MapPin,
  Wrench,
  Clock,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ICategory, ITechnician } from "@/types";
import { formatDuration } from "@/utils";
import TechnicianCard from "@/components/module/technician/technician-card";
import { Section } from "@/components/module/services/details-util";

type Props = {
  category: ICategory;
  technicians: ITechnician[];
};

const PubCategoryDetails = ({ category, technicians }: Props) => {

  const uniqueTechnicians = technicians.filter(
    (tech, index, self) =>
      index === self.findIndex((t) => t.id === tech.id),
  );

  const availableCount = uniqueTechnicians.filter(
    (t) => t.status === "AVAILABLE",
  ).length;

  const ratings = uniqueTechnicians
    .map((t) => Number(t.rating ?? 0))
    .filter((r) => Number.isFinite(r) && r > 0);
  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
      : 0;

  const techniciansHref = `/technician`;

  return (
    <div className="w-full">
      <header className="mb-5 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

        <div className="flex min-w-0 items-start gap-4">
          <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15 sm:size-20">

            <Wrench className="size-8" aria-hidden />

          </span>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {category.name}
              </h1>
              <Badge
                variant={category.isActive !== false ? "accepted" : "outline"}
                className="gap-1.5 rounded-full ring-1 ring-border"
              >
                <span
                  className={`size-1.5 rounded-full ${category.isActive !== false ? "bg-emerald-500" : "bg-muted-foreground"
                    }`}
                  aria-hidden
                />
                {category.isActive !== false ? "Active category" : "Inactive category"}
              </Badge>
            </div>

            {category.description && (
              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-3.5 text-primary" aria-hidden />
                {category.description}
              </p>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <Clock className="size-3.5" aria-hidden />
                {formatDuration(category.duration)} service
              </span>
              <span className="text-muted-foreground">·</span>
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <Wrench className="size-3.5" aria-hidden />
                {category.skill.length} {category.skill.length === 1 ? "skill" : "skills"}
              </span>
            </div>
          </div>
        </div>


        <div className="flex w-full flex-wrap gap-2 md:w-auto md:shrink-0">
          <Button asChild className="flex-1 rounded-xl md:flex-none">
            <Link href={techniciansHref}>
              <UsersRound className="size-4" aria-hidden />
              Browse technicians
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="flex-1 rounded-xl md:flex-none"
          >
            <Link href="/category">
              <ArrowRight className="size-4" aria-hidden />
              All categories
            </Link>
          </Button>
        </div>
      </header>

      <section aria-label="Category summary" className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-secondary/50 p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Durations</p>
          <p className="mt-1 text-2xl font-semibold">{formatDuration(category.duration)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-secondary/50 p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Technicians</p>
          <p className="mt-1 text-2xl font-semibold">{uniqueTechnicians.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-secondary/50 p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Available now</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-600">{availableCount}</p>
        </div>
        <div className="rounded-2xl border border-border bg-secondary/50 p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Avg. rating</p>
          <p className="mt-1 text-2xl font-semibold">
            {averageRating > 0 ? averageRating.toFixed(1) : "New"}
          </p>
        </div>
      </section>

      <div className="flex flex-col gap-4">
        <Section
          title={`Technicians (${uniqueTechnicians.length})`}
          action={
            uniqueTechnicians.length > 0 ? (
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="gap-1.5 rounded-full text-primary hover:text-primary"
              >
                <Link href={techniciansHref}>
                  View all
                  <ArrowRight className="size-3.5" aria-hidden />
                </Link>
              </Button>
            ) : undefined
          }
          className="rounded-2xl"
        >
          {uniqueTechnicians.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {uniqueTechnicians.map((technician) => (
                <TechnicianCard
                  key={technician.id}
                  technician={technician}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border px-4 py-8 text-center">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Wrench className="size-5" aria-hidden />
              </span>
              <p className="text-sm font-medium">No technicians listed</p>
              <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
                No technician currently offers services in this category.
              </p>
            </div>
          )}
        </Section>
      </div>
    </div>
  );
};

export default PubCategoryDetails;
