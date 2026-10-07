"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import {
  formatAddress,
  formatMemberSince,
  maskNid,
} from "@/components/module/profile/profile-helpers";
import {
  InfoRow,
  ProfileHeader,
  RegionCard,
  SectionCard,
  StatusBadge,
} from "@/components/module/profile/profile-ui";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMe } from "@/hooks";

const ManagerProfile = () => {
  const { data, isPending } = useGetMe();
  const [showNid, setShowNid] = useState(false);

  if (isPending) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 p-4">
        <Skeleton className="h-44 rounded-2xl" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  const me = data?.data as any;
  const user = me?.user ?? me ?? {};
  const mgr = me?.manager ?? me ?? {};
  const regions: any[] = mgr?.region ?? mgr?.regions ?? [];
  const list = regions.length
    ? regions
    : [
        { area: "Test Region 1", description: "Description of region" },
        { area: "Test Region 2", description: "Description of region" },
      ];
  const addr = formatAddress(mgr?.address) ?? "Test, Test street, 1000";

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-6">
        <ProfileHeader
          name={user?.name ?? "Test Manager 1"}
          email={user?.email ?? "manager.test1@mail.com"}
          roleLabel="Manager"
          imageUrl={user?.profileImg}
          topRight="Profile"
          backHref="/manager-dashboard"
          badges={
            <>
              <StatusBadge>● Active</StatusBadge>
              <StatusBadge>✓ Verified</StatusBadge>
            </>
          }
        />
        <div className="grid gap-4 md:grid-cols-2">
          <SectionCard title="Personal Information">
            <InfoRow label="Full name" value={user?.name ?? "Test Manager 1"} />
            <InfoRow
              label="Email"
              value={user?.email ?? "manager.test1@mail.com"}
            />
            <InfoRow label="Phone" value={mgr?.phone ?? "015365987458"} />
            <InfoRow label="Address" value={addr} />
            <div className="flex items-center justify-between gap-4 border-b border-border/60 py-3 last:border-0">
              <span className="text-[14px] text-muted-foreground">NID</span>
              <span className="flex items-center gap-2 text-right text-[14px] font-semibold text-foreground">
                <span className="tracking-widest">
                  {showNid && mgr?.nid ? mgr.nid : maskNid(mgr?.nid)}
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
          <SectionCard title={`Assigned Regions · ${list.length} Active`}>
            <div className="space-y-3">
              {list.map((r: any, i: number) => (
                <RegionCard
                  key={r?.id ?? i}
                  title={r.area ?? r.name ?? `Region ${i + 1}`}
                  sub={`Active · ${r.description ?? "Description of region"}`}
                />
              ))}
            </div>
          </SectionCard>
        </div>
        <SectionCard title="Account Security">
          <div className="flex flex-wrap gap-2">
            <StatusBadge>● Active</StatusBadge>
            <StatusBadge>✓ Email verified</StatusBadge>
            <StatusBadge>Credential authentication</StatusBadge>
          </div>
          <p className="mt-3 text-[14px] text-muted-foreground">
            Member since {formatMemberSince(user?.createdAt ?? mgr?.createdAt)}
          </p>
        </SectionCard>
      </div>
    </div>
  );
};

export default ManagerProfile;
