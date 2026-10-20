import { ArrowRight, BriefcaseBusiness, MapPin, Star } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { ITechnician, ITechStatus } from "@/types";
import { badgeText, getFallbackText, statusVarient } from "@/utils";

const STATUS_DOT: Record<ITechStatus, string> = {
  AVAILABLE: "bg-emerald-500",
  BUSY: "bg-blue-500",
  OFF_DUTY: "bg-muted-foreground",
};

type Props = {
  technician: ITechnician;
};

const PubRegionTechnicianCard = ({ technician }: Props) => {
  const rating = Number(technician.rating ?? 0);

  return (
    <Link
      href={`/technician/details?id=${technician.id}`}
      className="group block h-full rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Card className="h-full gap-0 p-0 shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-primary/30 group-hover:shadow-lg">
        <CardContent className="flex h-full flex-col p-4">
          <div className="flex items-start gap-3">
            <Avatar className="size-11 shrink-0 ring-1 ring-primary/15">
              <AvatarImage
                src={technician.user.profileImg ?? ""}
                alt={technician.user.name}
              />
              <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                {getFallbackText(technician.user.name)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate font-semibold">{technician.user.name}</p>
                <Badge
                  variant={statusVarient(technician.status)}
                  className="gap-1.5 rounded-full"
                >
                  <span
                    className={`size-1.5 rounded-full ${STATUS_DOT[technician.status]
                      }`}
                    aria-hidden
                  />
                  {badgeText(technician.status)}
                </Badge>
              </div>

              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin
                  className="size-3.5 shrink-0 text-primary"
                  aria-hidden
                />
                <span className="truncate">
                  {technician.address?.city || "Area not shared"}
                </span>
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 divide-x divide-border rounded-xl border border-border/70 bg-secondary/40 py-2.5">
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
                {technician.jobsCompleted ?? 0}
              </span>
              <span className="text-[11px] text-muted-foreground">
                jobs done
              </span>
            </div>
          </div>

          <div className="mt-auto pt-4">
            <div className="flex items-center justify-center gap-1.5 rounded-lg border border-border py-1 text-sm font-medium transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
              View profile
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

export default PubRegionTechnicianCard;
