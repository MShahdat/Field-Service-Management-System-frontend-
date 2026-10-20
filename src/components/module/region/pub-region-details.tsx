"use client";

import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BriefcaseBusiness,
  MapPin,
  Star,
  UserRound,
  UsersRound,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { IRegion } from "@/types";
import { CopyId, Section, SummaryCard } from "../services/details-util";
import PubRegionManagerCard from "./pub-region-manager-card";
import PubRegionTechnicianCard from "./pub-region-technician-card";
import TechnicianCard from "../technician/technician-card";

type Props = {
  region: IRegion;
};

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const EmptyState = ({ icon: Icon, title, description }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border px-4 py-8 text-center">
      <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="size-5" aria-hidden />
      </span>
      <p className="text-sm font-medium">{title}</p>
      <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
};

const PubRegionDetails = ({ region }: Props) => {
  const managers = region.manager ?? [];
  const technicians = region.technicians ?? [];

  const availableTechnicians = technicians.filter(
    (technician) => technician.status === "AVAILABLE",
  ).length;

  const ratings = technicians
    .map((technician) => Number(technician.rating ?? 0))
    .filter((rating) => Number.isFinite(rating) && rating > 0);

  const averageRating =
    ratings.length > 0
      ? ratings.reduce((total, rating) => total + rating, 0) / ratings.length
      : 0;

  const totalJobs = technicians.reduce(
    (total, technician) => total + Number(technician.jobsCompleted ?? 0),
    0,
  );

  const techniciansHref = `/technician?region=${encodeURIComponent(region.area)}`;

  return (
    <div className="w-full">
      <header className="mb-5 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15 sm:size-20">
            <MapPin className="size-8" aria-hidden />
          </span>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {region.area}
              </h1>
              <Badge
                variant={region.isActive ? "accepted" : "outline"}
                className="gap-1.5 rounded-full ring-1 ring-border"
              >
                <span
                  className={`size-1.5 rounded-full ${region.isActive ? "bg-emerald-500" : "bg-muted-foreground"
                    }`}
                  aria-hidden
                />
                {region.isActive ? "Active region" : "Inactive region"}
              </Badge>
            </div>

            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-3.5 text-primary" aria-hidden />
              Service coverage area
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <CopyId value={region.id} label="Copy region ID" />
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
            <Link href="/region">All regions</Link>
          </Button>
        </div>
      </header>

      <Section title="About this region" className="mb-4 rounded-2xl">
        <p className="text-sm leading-relaxed text-foreground/90">
          {region.description?.trim()
            ? region.description
            : "This region does not have a description yet."}
        </p>
      </Section>

      <section
        aria-label="Region summary"
        className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4"
      >
        <SummaryCard
          icon={UserRound}
          label="Managers"
          value={managers.length}
          sub="Covering this region"
        />
        <SummaryCard
          icon={Wrench}
          label="Technicians"
          value={technicians.length}
          sub={`${availableTechnicians} available now`}
        />
        <SummaryCard
          icon={Star}
          label="Average rating"
          value={averageRating > 0 ? averageRating.toFixed(1) : "New"}
          sub={`${ratings.length} rated technicians`}
        />
        <SummaryCard
          icon={BriefcaseBusiness}
          label="Jobs completed"
          value={totalJobs}
          sub="By region technicians"
        />
      </section>

      <div className="flex flex-col gap-4">
        <Section
          title={`Managers (${managers.length})`}
          className="rounded-2xl"
        >
          {managers.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {managers.map((manager) => (
                <PubRegionManagerCard key={manager.id} manager={manager} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={UserRound}
              title="No managers listed"
              description="No manager is currently assigned to this region."
            />
          )}
        </Section>

        <Section
          title={`Technicians (${technicians.length})`}
          action={
            technicians.length > 0 ? (
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
          {technicians.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {technicians.map((technician) => (
                <PubRegionTechnicianCard
                  key={technician.id}
                  technician={technician}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Wrench}
              title="No technicians listed"
              description="No technician currently covers this region."
            />
          )}
        </Section>
      </div>
    </div>
  );
};

export default PubRegionDetails;
