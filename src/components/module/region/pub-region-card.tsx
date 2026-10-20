"use client";

import { MapPin, UserRound, Wrench } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSingleRegion } from "@/hooks";
import type { IRegion } from "@/types";
import { getFallbackText } from "@/utils";

type Props = {
  region: IRegion;
};

type TeamMember = {
  id: string;
  name: string;
  profileImg?: string | null;
};

type AvatarStackProps = {
  people: TeamMember[];
  total: number;
  pending: boolean;
};

const AVATAR_SKELETON_KEYS = [
  "avatar-skeleton-1",
  "avatar-skeleton-2",
  "avatar-skeleton-3",
];

const Skyline = () => (
  <svg
    viewBox="0 0 300 96"
    preserveAspectRatio="xMidYMax slice"
    aria-hidden
    className="absolute inset-0 h-full w-full"
  >
    <circle cx="240" cy="28" r="14" className="fill-white/20" />

    <g className="fill-white/15">
      <rect x="14" y="52" width="26" height="44" />
      <rect x="48" y="40" width="22" height="56" />
      <rect x="78" y="58" width="30" height="38" />
      <rect x="118" y="34" width="24" height="62" />
      <rect x="150" y="50" width="28" height="46" />
      <rect x="186" y="44" width="22" height="52" />
      <rect x="216" y="56" width="32" height="40" />
      <rect x="256" y="46" width="26" height="50" />
    </g>

    <g className="fill-black/35">
      <rect x="-4" y="70" width="34" height="26" />
      <rect x="36" y="62" width="20" height="34" />
      <rect x="62" y="74" width="30" height="22" />
      <rect x="100" y="58" width="26" height="38" />
      <rect x="132" y="72" width="34" height="24" />
      <rect x="172" y="64" width="22" height="32" />
      <rect x="200" y="76" width="30" height="20" />
      <rect x="236" y="66" width="24" height="30" />
      <rect x="266" y="74" width="40" height="22" />
    </g>
  </svg>
);

const AvatarStack = ({ people, total, pending }: AvatarStackProps) => {
  if (pending) {
    return (
      <div className="flex -space-x-2">
        {AVATAR_SKELETON_KEYS.map((key) => (
          <Skeleton
            key={key}
            className="size-6 rounded-full border-2 border-muted"
          />
        ))}
      </div>
    );
  }

  if (total === 0) {
    return (
      <p className="mt-2 text-[10px] text-muted-foreground">None assigned</p>
    );
  }

  const visible = people.slice(0, 4);
  const remaining = total - visible.length;

  return (
    <div className="mt-0 flex items-center">
      <div className="flex -space-x-2">
        {visible.map((person) => (
          <Avatar key={person.id} className="size-6 border-2 border-muted">
            <AvatarImage src={person.profileImg ?? ""} alt={person.name} />
            <AvatarFallback className="bg-primary/10 text-[9px] font-semibold text-primary">
              {getFallbackText(person.name)}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>

      {remaining > 0 && (
        <span className="ml-2 text-[10px] font-medium text-muted-foreground">
          +{remaining}
        </span>
      )}
    </div>
  );
};

type StatProps = {
  icon: typeof UserRound;
  label: string;
  count: number;
  warn?: boolean;
  pending: boolean;
  people: TeamMember[];
};

const Stat = ({ icon: Icon, label, count, warn, pending, people }: StatProps) => (
  <div className="min-w-0 flex-1 rounded-[10px] bg-muted px-3 py-1">
    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Icon className="size-3.5" aria-hidden />
      <AvatarStack people={people} total={count} pending={pending} />
    </p>
  </div>
);

const PubRegionCard = ({ region }: Props) => {
  const { data, isPending } = useGetSingleRegion(region.id);
  const detail = data?.data;

  const managers = detail?.manager ?? region.manager ?? [];
  const technicians = detail?.technicians ?? region.technicians ?? [];

  const managerCount = managers.length;
  const technicianCount = technicians.length;

  const countsPending =
    (region.manager === undefined || region.technicians === undefined) &&
    isPending;

  return (
    <Link
      href={`/region/details?id=${region.id}`}
      className="group block h-full rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Card className="relative h-full gap-0 overflow-hidden rounded-2xl border border-border/70 p-0 shadow-sm ring-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-primary/30 group-hover:shadow-lg">
        {/* Skyline band */}
        <div className="relative h-24 shrink-0 bg-primary">
          <Skyline />
          <span className="absolute top-3.5 right-3.5 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white">
            {region.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        <CardContent className="flex flex-1 flex-col px-5 pt-0 pb-5">
          <span className="relative -mt-[23px] flex size-[46px] shrink-0 items-center justify-center rounded-xl border border-border bg-card text-primary outline-[3px] outline-card dark:text-foreground">
            <MapPin className="size-[22px]" aria-hidden />
          </span>

          <h3
            title={region.area}
            className="mt-2.5 truncate text-[17px] leading-snug font-medium"
          >
            {region.area}
          </h3>

          <p className="mt-0.5 line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
            {region.description?.trim()
              ? region.description
              : "No description has been added for this region yet."}
          </p>

          <div className="mt-3.5 flex gap-2">
            <Stat
              icon={UserRound}
              label="Managers"
              count={managerCount}
              warn={managerCount === 0}
              pending={countsPending}
              people={managers.map((manager) => ({
                id: manager.id,
                name: manager.user.name,
                profileImg: manager.user.profileImg,
              }))}
            />

            <Stat
              icon={Wrench}
              label="Technicians"
              count={technicianCount}
              pending={countsPending}
              people={technicians.map((technician) => ({
                id: technician.id,
                name: technician.user.name,
                profileImg: technician.user.profileImg,
              }))}
            />
          </div>

          {/* The whole card is already a Link, so this is a styled div, not a nested link */}
          <div className="mt-auto pt-4">
            <div className="rounded-[10px] bg-primary px-3 py-1 text-center text-sm font-medium text-primary-foreground transition-colors group-hover:bg-primary/90">
              View region details
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PubRegionCard;