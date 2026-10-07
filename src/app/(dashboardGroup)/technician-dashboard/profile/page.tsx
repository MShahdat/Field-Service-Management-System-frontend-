"use client";

import { normalizeAvailability } from "@/components/module/profile/profile-helpers";
import {
  AvailabilityRow,
  InfoRow,
  ProfileHeader,
  RegionCard,
  SectionCard,
  SkillBadge,
  StatCard,
  StatusBadge,
} from "@/components/module/profile/profile-ui";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMe } from "@/hooks";

const FALLBACK_AVAIL = [
  { key: "mon", dayIndex: 1, day: "Monday", label: "8 AM - 6 PM", pct: 82 },
  { key: "tue", dayIndex: 2, day: "Tuesday", label: "8 AM - 8 PM", pct: 100 },
  { key: "wed", dayIndex: 3, day: "Wednesday", label: "8 AM - 8 PM", pct: 100 },
  { key: "thu", dayIndex: 4, day: "Thursday", label: "8 AM - 8 PM", pct: 100 },
  { key: "fri", dayIndex: 5, day: "Friday", label: "8 AM - 6 PM", pct: 82 },
  { key: "sat", dayIndex: 6, day: "Saturday", label: "8 AM - 6 PM", pct: 82 },
];

const TechnicianProfile = () => {
  const { data, isPending } = useGetMe();

  if (isPending) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 p-4">
        <Skeleton className="h-44 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
      </div>
    );
  }

  const me = data?.data as any;
  const user = me?.user ?? me ?? {};
  const tech = me?.technician ?? me ?? {};
  const regions: any[] = tech?.regions ?? tech?.region ?? [];
  const list = regions.length
    ? regions
    : [{ area: "Test Region 1" }, { area: "Test Region 2" }];
  const skills: any[] = tech?.skills ?? [];
  const statusLabel = tech?.status
    ? String(tech.status).charAt(0) + String(tech.status).slice(1).toLowerCase()
    : "Available";

  const normalized = normalizeAvailability(tech?.availability);
  const avail = normalized.length > 0 ? normalized : FALLBACK_AVAIL;
  const isLiveData = normalized.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-6">
        <ProfileHeader
          name={user?.name ?? "Test Technician 01"}
          email={user?.email ?? "tech.test1@mail.com"}
          roleLabel="Technician"
          imageUrl={user?.profileImg}
          topRight="Technician Profile"
          backHref="/technician-dashboard"
          badges={
            <>
              <StatusBadge>● {statusLabel}</StatusBadge>
              <StatusBadge>
                ✓{" "}
                {tech?.isProfileCompleted === false
                  ? "Profile incomplete"
                  : "Profile completed"}
              </StatusBadge>
            </>
          }
        />
        <SectionCard title="Performance">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard value={String(tech?.rating ?? "0.0")} label="Rating" />
            <StatCard
              value={String(tech?.jobsCompleted ?? 0)}
              label="Jobs done"
            />
            <StatCard value={statusLabel} label="Status" />
            <StatCard value={String(list.length)} label="Regions" />
          </div>
        </SectionCard>
        <div className="grid gap-4 md:grid-cols-2">
          <SectionCard title="Professional Information">
            <InfoRow
              label="Bio"
              value={tech?.bio ?? "Certified electrician 8+ yrs"}
            />
            <InfoRow label="Phone" value={tech?.phone ?? "+8801912345678"} />
            <InfoRow
              label="Address"
              value={
                tech?.address
                  ? [tech.address.street, tech.address.city]
                      .filter(Boolean)
                      .join(", ") || "Test, test street"
                  : "Test, test street"
              }
            />
          </SectionCard>
          <SectionCard title={`Service Regions · ${list.length}`}>
            <div className="space-y-3">
              {list.map((r: any, i: number) => (
                <RegionCard
                  key={r?.id ?? i}
                  title={r.area ?? r.name ?? `Region ${i + 1}`}
                  sub="Active"
                />
              ))}
            </div>
          </SectionCard>
        </div>
        <SectionCard title={`Skills · ${skills.length}`}>
          {skills.length === 0 ? (
            <p className="text-[14px] text-muted-foreground">
              No skills added yet. Skills assigned by admin will appear here.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {skills.map((s: any) => (
                <SkillBadge
                  key={s.id ?? s.name}
                  name={s.name}
                  category={s.category?.name}
                />
              ))}
            </div>
          )}
        </SectionCard>
        <SectionCard title={`Weekly Availability · ${avail.length} days`}>
          {!isLiveData && (
            <p className="pb-1 text-[12px] text-muted-foreground">
              Default hours shown (Asia/Dhaka). Live schedule will appear here
              once availability is set.
            </p>
          )}
          <div className="min-w-0">
            {avail.map(
              (a: { key: string; day: string; label: string; pct: number }) => (
                <AvailabilityRow
                  key={a.key}
                  day={a.day}
                  label={a.label}
                  pct={a.pct}
                />
              ),
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default TechnicianProfile;
