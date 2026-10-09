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
import DataNotFoundCard from "@/shared/data-not-found";
import type { ILoggedUser, IManager, IRegion } from "@/types";

const ManagerProfile = () => {
  const { data, isPending, isError } = useGetMe();
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

  if (isError || !data?.data) {
    return (
      <div className="mx-auto max-w-6xl p-4">
        <DataNotFoundCard
          message="Profile not found"
          description="We could not load your manager profile. Please try again."
        />
      </div>
    );
  }

  const me = data.data as ILoggedUser;
  const mgr: IManager | null | undefined = me.manager;

  const regions: IRegion[] = mgr?.region ?? [];
  const addr: string | null = formatAddress(mgr?.address);
  const memberSince =
    mgr?.createdAt != null && mgr.createdAt !== ""
      ? formatMemberSince(mgr.createdAt)
      : "—";
  const verificationLabel = mgr?.verificationStatus ?? "—";
  const accountStatus = me.status ?? "Active";

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-6">
        <ProfileHeader
          name={me.name ?? "—"}
          email={me.email ?? "—"}
          roleLabel="Manager"
          imageUrl={me.profileImg}
          topRight="Profile"
          backHref="/manager-dashboard"
          badges={
            <>
              <StatusBadge>● {accountStatus}</StatusBadge>
              <StatusBadge>
                {me.emailVerified ? "✓ Verified" : "○ Unverified"}
              </StatusBadge>
              {mgr?.verificationStatus ? (
                <StatusBadge>· {verificationLabel}</StatusBadge>
              ) : null}
            </>
          }
        />
        <div className="grid gap-4 md:grid-cols-2">
          <SectionCard title="Personal Information">
            <InfoRow label="Full name" value={me.name ?? "—"} />
            <InfoRow label="Email" value={me.email ?? "—"} />
            {mgr?.phone ? (
              <InfoRow label="Phone" value={mgr.phone} />
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
          <SectionCard title={`Assigned Regions · ${regions.length} Active`}>
            {regions.length === 0 ? (
              <p className="text-[14px] text-muted-foreground">
                No regions assigned yet. Regions assigned by admin will appear
                here.
              </p>
            ) : (
              <div className="space-y-3">
                {regions.map((r: IRegion, i: number) => (
                  <RegionCard
                    key={r.id ?? i}
                    title={r.area ?? `Region ${i + 1}`}
                    sub={`Active · ${r.description ?? "No description"}`}
                  />
                ))}
              </div>
            )}
          </SectionCard>
        </div>
        <SectionCard title="Account Security">
          <div className="flex flex-wrap gap-2">
            <StatusBadge>● {accountStatus}</StatusBadge>
            <StatusBadge>
              {me.emailVerified ? "✓ Email verified" : "○ Email unverified"}
            </StatusBadge>
            <StatusBadge>
              {me.authProvider === "CREDENTIAL"
                ? "Credential authentication"
                : (me.authProvider ?? "—")}
            </StatusBadge>
          </div>
          <p className="mt-3 text-[14px] text-muted-foreground">
            Member since {memberSince}
          </p>
        </SectionCard>
      </div>
    </div>
  );
};

export default ManagerProfile;
