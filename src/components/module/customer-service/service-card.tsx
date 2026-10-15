"use client";

import {
  ArrowRight,
  CalendarDays,
  Clock,
  Hourglass,
  MapPin,
  Wrench,
  XCircle,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProfileAvater from "@/shared/avater";
import type { ServiceRequest } from "@/types";
import { badgeText, statusVarient } from "@/utils";
import { formatClock, formatServiceDate } from "./details-util";

type Props = {
  service: ServiceRequest;
};

const MyServiceCard = ({ service }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Card className="h-full overflow-hidden py-0 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      {/* Category banner */}
      <div className="flex items-center gap-3 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent px-5 pt-4 pb-3.5 sm:px-6">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/30">
          <Wrench className="size-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">
            {service.category?.name ?? "Service"}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {(service.region as { city?: string } | null)?.city
              ? `${(service.region as { city?: string }).city} · `
              : ""}
            {service.duration ? `${service.duration} min job` : "Home service"}
          </p>
        </div>
        <Badge variant={statusVarient(service.status)} className="shrink-0">
          {badgeText(service.status)}
        </Badge>
      </div>

      <CardContent className="flex h-full flex-col px-2 pb-5 sm:px-6 sm:pb-6">
        {/* <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <span aria-hidden className="size-1.5 rounded-full bg-primary" />
          {badgeText(service.priority)} priority
        </div> */}

        <h3 className="mt-2 line-clamp-1 text-lg font-semibold leading-snug tracking-tight text-card-foreground">
          {service.title === "" ? "Title of this service" : service.title}
        </h3>

        {/* Schedule panel */}
        <div className="mt-3.5 space-y-1.5 rounded-xl bg-secondary/70 p-2.5 dark:bg-secondary/40">
          <div className="flex items-center gap-2">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-card text-primary shadow-xs">
              <CalendarDays className="size-3.5" aria-hidden />
            </span>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Date
            </p>
            <p className="ml-auto text-[13px] font-semibold text-foreground">
              {formatServiceDate(service.servicingDate)}
            </p>
          </div>
          <div className="flex items-center gap-2 border-t border-border/60 pt-1.5">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-card text-primary shadow-xs">
              <Clock className="size-3.5" aria-hidden />
            </span>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Time
            </p>
            <p className="ml-auto text-[13px] font-semibold whitespace-nowrap text-foreground">
              {formatClock(service.preferredStartTime)} –{" "}
              {formatClock(service.preferredEndTime)}
            </p>
          </div>
        </div>

        {service.address?.city || service.address?.street ? (
          <p className="mt-2.5 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" aria-hidden />
            {[service.address?.street, service.address?.city]
              .filter(Boolean)
              .join(", ")}
          </p>
        ) : null}

        <div className="mt-3.5">
          {service?.status === "REJECTED" ? (
            <div className="flex items-start gap-2.5 rounded-xl border border-destructive/25 bg-destructive/10 px-3 py-2.5 text-destructive">
              <XCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
              <div className="min-w-0">
                <p className="text-sm font-semibold">Why it was rejected</p>
                <p className="line-clamp-2 text-xs leading-snug opacity-90">
                  {service.rejectionReason ?? "No reason was provided."}
                </p>
              </div>
            </div>
          ) : service?.workOrders?.technician ? (
            <div className="flex items-center gap-2.5 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2.5">
              <ProfileAvater
                name={service.workOrders.technician.user.name}
                imageUrl={service.workOrders.technician.user.profileImg}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {service.workOrders.technician.user.name}
                </p>
                <p className="text-xs text-muted-foreground">Your technician</p>
              </div>
              <span
                aria-hidden
                className="size-2 shrink-0 rounded-full bg-emerald-500"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2.5 rounded-xl border-[1.5px] border-dashed border-amber-500/40 bg-amber-500/5 px-3 py-2.5">
              <Hourglass
                className="size-5 shrink-0 text-amber-600 dark:text-amber-400"
                aria-hidden
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  Technician not assigned yet
                </p>
                <p className="text-xs leading-snug text-muted-foreground">
                  A technician will be assigned after review.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 pt-1">
          <Button
            onClick={() => {
              router.push(`${pathname}/${service.id}`);
            }}
            type="button"
            className="w-full"
          >
            View details <ArrowRight />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MyServiceCard;
