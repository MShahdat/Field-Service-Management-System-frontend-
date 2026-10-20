"use client";

import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarClock,
  MapPin,
  Star,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { ITechnicianPublic, ITechStatus } from "@/types";
import { badgeText, getFallbackText, statusVarient } from "@/utils";

type Props = {
  technician: ITechnicianPublic;
};

const STATUS_DOT: Record<ITechStatus, string> = {
  AVAILABLE: "bg-emerald-500",
  BUSY: "bg-blue-500",
  OFF_DUTY: "bg-muted-foreground",
};

const getAvailabilityLabel = (technician: ITechnicianPublic) => {
  const recurring = technician.availability.filter(
    (slot) => slot.type === "RECURRING",
  );
  const days = new Set(
    recurring
      .map((slot) => slot.dayOfWeek)
      .filter((day): day is number => day !== null),
  );

  if (days.size > 0) {
    return `${days.size} ${days.size === 1 ? "day" : "days"}/week`;
  }

  const specialDates = technician.availability.filter(
    (slot) => slot.type === "ONE_OFF" && slot.date,
  ).length;

  if (specialDates > 0) {
    return `${specialDates} ${specialDates === 1 ? "date" : "dates"}`;
  }

  return "On request";
};

const TechnicianCard = ({ technician }: Props) => {
  const rating = Number(technician.rating ?? 0);
  const location =
    technician.address?.city ||
    technician.regions[0]?.area ||
    "Service area on request";
  const availability = getAvailabilityLabel(technician);
  const visibleSkills = technician.skills.slice(0, 3);
  const moreSkills = technician.skills.length - visibleSkills.length;

  return (
    <Link
      href={`/technician/details?id=${technician.id}`}
      className="group block h-full rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Card className="h-full gap-0 overflow-hidden p-0 shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-primary/30 group-hover:shadow-xl group-hover:shadow-black/[0.06]">
        <div className="relative h-16 overflow-hidden border-b border-border bg-secondary/70">
          <div className="absolute inset-x-0 top-0 h-[3px] bg-primary" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, color-mix(in oklch, var(--foreground) 10%, transparent) 1px, transparent 1px)",
              backgroundSize: "14px 14px",
            }}
          />

          <Badge
            variant={statusVarient(technician.status)}
            className="absolute top-3 right-3 gap-1.5 rounded-full shadow-sm"
          >
            <span
              className={`size-1.5 rounded-full ${STATUS_DOT[technician.status]}`}
              aria-hidden
            />
            {badgeText(technician.status)}
          </Badge>
        </div>

        <CardContent className="flex flex-1 flex-col px-5 pb-5">
          <div className="-mt-10 flex justify-center">
            <Avatar className="size-20 rounded-full shadow-sm ring-4 ring-card">
              <AvatarImage
                src={technician.user.profileImg ?? ""}
                alt={technician.user.name}
              />
              <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                {getFallbackText(technician.user.name)}
              </AvatarFallback>
            </Avatar>
          </div>

          <h3 className="mt-3 line-clamp-1 text-center text-base font-semibold">
            {technician.user.name}
          </h3>

          <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="size-3.5 shrink-0 text-primary" aria-hidden />
            <span className="truncate">{location}</span>
          </p>

          <div className="mt-4 grid grid-cols-2 divide-x divide-border rounded-xl border border-border/70 bg-secondary/40 py-3">
            <div className="flex flex-col items-center gap-0.5">
              <span className="inline-flex items-center gap-1 text-sm font-semibold tabular-nums">
                <Star
                  className="size-3.5 fill-amber-500 text-amber-500"
                  aria-hidden
                />
                {rating > 0 ? rating.toFixed(1) : "New"}
              </span>
              <span className="text-[11px] text-muted-foreground">rating</span>
            </div>

            <div className="flex flex-col items-center gap-0.5">
              <span className="inline-flex items-center gap-1 text-sm font-semibold tabular-nums">
                <BriefcaseBusiness
                  className="size-3.5 text-muted-foreground"
                  aria-hidden
                />
                {technician.jobsCompleted}
              </span>
              <span className="text-[11px] text-muted-foreground">
                jobs done
              </span>
            </div>
          </div>


          <div className="mt-auto pt-4">
            <div className="flex items-center justify-between gap-3 border-t border-border/70 pt-3 text-xs text-muted-foreground">
              <span className="inline-flex min-w-0 items-center gap-1.5">
                <MapPin
                  className="size-3.5 shrink-0 text-primary"
                  aria-hidden
                />
                <span className="truncate">
                  {technician.regions.length} service area
                  {technician.regions.length === 1 ? "" : "s"}
                </span>
              </span>

              <span className="inline-flex shrink-0 items-center gap-1.5">
                <CalendarClock className="size-3.5 text-primary" aria-hidden />
                {availability}
              </span>
            </div>

            <div className="mt-3 flex h-8 items-center justify-center gap-1.5 rounded-lg border border-border text-sm font-medium transition-colors group-hover:border-primary bg-primary text-primary-foreground">
              View full profile
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default TechnicianCard;
