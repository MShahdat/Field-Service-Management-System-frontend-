"use client";

import Link from "next/link";
import { ArrowRight, Clock, UsersRound, Wrench } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { ICategory } from "@/types";
import { dedupeTechniciansById, formatDuration } from "@/utils";
import CategoryBg from "./category-bg";

type Props = {
  category: ICategory;
};

const PublicCategoryCard = ({ category }: Props) => {

  const uniqueTechnicians = dedupeTechniciansById(
    category.skill?.flatMap((skill) => skill.technician ?? []) ?? [],
  );

  const availableTechnicians = uniqueTechnicians.filter(
    (technician) => technician.status === "AVAILABLE",
  ).length;
  const isActive = category.isActive !== false;

  return (
    <Card className="relative h-full gap-0 overflow-hidden rounded-2xl border border-border bg-card p-0 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg">
      <div className="relative h-16 overflow-visible rounded-t-2xl bg-primary">
        <CategoryBg />

        <div className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/20 px-3 py-1 text-xs font-medium text-primary-foreground backdrop-blur-sm">
          <span
            className={`size-1.5 rounded-full ${isActive ? "bg-primary-foreground" : "bg-primary-foreground/50"}`}
            aria-hidden
          />
          {isActive ? `${availableTechnicians} available` : "Inactive"}
        </div>

        <div className="absolute -bottom-6 left-1/2 z-10 flex size-12 -translate-x-1/2 items-center justify-center rounded-full border border-primary bg-card text-primary shadow-sm">

          <Wrench className="size-4" aria-hidden />

        </div>
      </div>

      <CardContent className="flex flex-1 flex-col px-4 pb-4 pt-8 text-center">
        <h3 className="line-clamp-1 text-base font-semibold tracking-tight">
          {category.name}
        </h3>
        {category.description && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {category.description}
          </p>
        )}

        <div className="mt-4 grid grid-cols-2 overflow-hidden rounded-xl border border-border bg-primary/10">
          <div className="flex min-h-14 flex-col items-center justify-center border-r border-border px-2 py-2">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
              <Clock className="size-3.5 text-primary" aria-hidden />
              {formatDuration(category.duration)}
            </span>
            <span className="text-xs text-muted-foreground">duration</span>
          </div>
          <div className="flex min-h-14 flex-col items-center justify-center px-2 py-2">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
              <UsersRound className="size-3.5 text-primary" aria-hidden />
              {uniqueTechnicians.length}
            </span>
            <span className="text-xs text-muted-foreground">
              {uniqueTechnicians.length === 1 ? "technician" : "technicians"}
            </span>
          </div>
        </div>

        <Link
          href={`/category/details?id=${category.id}`}
          className="group mt-3 inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border border-primary text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label={`View details for ${category.name}`}
        >
          View details
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
      </CardContent>
    </Card>
  );
};

export default PublicCategoryCard;
