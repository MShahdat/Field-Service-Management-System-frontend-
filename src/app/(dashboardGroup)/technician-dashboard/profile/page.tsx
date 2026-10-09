"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { formatClock } from "@/components/module/customer-service/details-util";
import {
  formatAddress,
  maskNid,
  type NormalizedAvailability,
  normalizeAvailability,
} from "@/components/module/profile/profile-helpers";
import {
  AvailabilityRow,
  InfoRow,
  ProfileHeader,
  RegionCard,
  SectionCard,
  SkillBadge,
  StatCard,
} from "@/components/module/profile/profile-ui";
import { TechnicianProfileModal } from "@/components/module/profile/technician-profile-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMe } from "@/hooks";
import DataNotFoundCard from "@/shared/data-not-found";
import type { ILoggedUser, IRegion, ISkills } from "@/types";
import type { ITechnician } from "@/types/technician.types";
import { badgeText, statusVarient } from "@/utils";

const TechnicianProfile = () => {
  const [editOpen, setEditOpen] = useState(false);
  const [showNid, setShowNid] = useState(false);
  const { data, isPending, isError } = useGetMe();

  if (isPending) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 p-4">
        <Skeleton className="h-44 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="mx-auto max-w-6xl p-4">
        <DataNotFoundCard
          message="Profile not found"
          description="We could not load your technician profile. Please try again."
        />
      </div>
    );
  }

  const me = data.data as ILoggedUser;
  const tech: ITechnician | null | undefined = me.technician;

  const regions: IRegion[] = tech?.regions ?? [];
  const skills: ISkills[] = tech?.skills ?? [];
  const availability: NormalizedAvailability[] = normalizeAvailability(
    tech?.availability ?? [],
  );

  const statusLabel: string | undefined = tech?.status;
  const addr: string | null = formatAddress(tech?.address);
  const incomplete = !tech?.isProfileCompleted;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-6">
        <ProfileHeader
          name={me.name ?? "—"}
          email={me.email ?? "—"}
          roleLabel="Technician"
          imageUrl={me.profileImg}
          topRight="Technician Profile"
          backHref="/technician-dashboard"
          onEdit={() => setEditOpen(true)}
          badges={
            <>
              {statusLabel ? (
                <Badge variant={statusVarient(statusLabel)}>
                  {badgeText(statusLabel)}
                </Badge>
              ) : (
                <Badge variant="secondary">No status</Badge>
              )}
              <Badge variant="requested">
                {tech?.isProfileCompleted
                  ? "✓ Profile Completed"
                  : "Profile Incomplete"}
              </Badge>
            </>
          }
        />

        {incomplete && (
          <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Your profile is incomplete — you are{" "}
              <span className="font-semibold text-foreground">
                not eligible
              </span>{" "}
              for services until phone, NID, bio, address, region, skill and
              availability are set.
            </p>
            <Button onClick={() => setEditOpen(true)} className="shrink-0">
              Complete Profile
            </Button>
          </div>
        )}

        <SectionCard title="Performance">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard
              value={tech?.rating != null ? String(tech.rating) : "—"}
              label="Rating"
            />
            <StatCard
              value={
                tech?.jobsCompleted != null ? String(tech.jobsCompleted) : "—"
              }
              label="Jobs done"
            />
            <StatCard value={statusLabel ?? "—"} label="Status" />
            <StatCard value={String(regions.length)} label="Regions" />
          </div>
        </SectionCard>

        <div className="grid gap-4 md:grid-cols-2">
          <SectionCard title="Professional Information">
            {tech?.bio ? (
              <InfoRow label="Bio" value={tech.bio} />
            ) : (
              <InfoRow label="Bio" value="Not added yet" muted />
            )}
            {tech?.phone ? (
              <InfoRow label="Phone" value={tech.phone} />
            ) : (
              <InfoRow label="Phone" value="Not added yet" muted />
            )}
            {addr ? (
              <InfoRow label="Address" value={addr} />
            ) : (
              <InfoRow label="Address" value="Not added yet" muted />
            )}
            <div className="flex items-center justify-between gap-4 border-b border-border/60 py-3 last:border-0">
              <span className="text-[14px] text-muted-foreground">NID</span>
              <span className="flex items-center gap-2 text-right text-[14px] font-semibold text-foreground">
                <span className="tracking-widest">
                  {showNid && tech?.nid ? tech.nid : maskNid(tech?.nid)}
                </span>
                <button
                  type="button"
                  onClick={() => setShowNid((v) => !v)}
                  aria-label={showNid ? "Hide NID" : "Show NID"}
                  aria-pressed={showNid}
                  title={showNid ? "Hide NID" : "Show NID"}
                  className="rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {showNid ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </span>
            </div>
          </SectionCard>

          <SectionCard title={`Service Regions · ${regions.length}`}>
            {regions.length === 0 ? (
              <p className="text-[14px] text-muted-foreground">
                No regions assigned yet. Add them to become eligible for
                services.
              </p>
            ) : (
              <div className="space-y-3 flex flex-wrap gap-4">
                {regions.map((r: IRegion, i: number) => (
                  <RegionCard
                    key={r.id ?? i}
                    title={r.area ?? "—"}
                    sub="Active"
                  />
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        <SectionCard title={`Skills · ${skills.length}`}>
          {skills.length === 0 ? (
            <p className="text-[14px] text-muted-foreground">
              No skills added yet. Add them to become eligible for services.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {skills.map((s: ISkills) => (
                <SkillBadge
                  key={s.id ?? s.name}
                  name={s.name}
                  category={s.category?.name}
                />
              ))}
            </div>
          )}
        </SectionCard>
        <SectionCard
          title={`Weekly Availability · ${availability.length} days`}
        >
          {availability.length === 0 ? (
            <p className="text-[14px] text-muted-foreground">
              Availability not set yet. Your weekly schedule (Asia/Dhaka) will
              appear here once availability is added.
            </p>
          ) : (
            <>
              <p className="pb-1 text-[12px] text-muted-foreground">
                Hours shown in Asia/Dhaka time — e.g. first slot{" "}
                {formatClock(tech?.availability?.[0]?.startTime)} –{" "}
                {formatClock(tech?.availability?.[0]?.endTime)}.
              </p>
              <div className="min-w-0">
                {availability.map((a: NormalizedAvailability) => (
                  <AvailabilityRow
                    key={a.key}
                    day={a.day}
                    label={a.label}
                    pct={a.pct}
                  />
                ))}
              </div>
            </>
          )}
        </SectionCard>

        {editOpen && (
          <TechnicianProfileModal
            open={editOpen}
            onOpenChange={setEditOpen}
            tech={tech}
          />
        )}
      </div>
    </div>
  );
};

export default TechnicianProfile;
