"use client";

import {
  InfoRow,
  ProfileHeader,
  SectionCard,
  StatCard,
  StatusBadge,
} from "@/components/module/profile/profile-ui";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMe } from "@/hooks";
import DataNotFoundCard from "@/shared/data-not-found";
import type { ILoggedUser } from "@/types";

const AdminProfile = () => {
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
          description="We could not load your admin profile. Please try again."
        />
      </div>
    );
  }

  const me = data.data as ILoggedUser;

  const emailStatus = me.emailVerified ? "Verified" : "Unverified";
  const authLabel =
    me.authProvider === "CREDENTIAL" ? "Credential" : (me.authProvider ?? "—");
  const accountStatus = me.status ?? "—";

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-6">
        <ProfileHeader
          name={me.name ?? "—"}
          email={me.email ?? "—"}
          roleLabel="System Administrator"
          imageUrl={me.profileImg}
          topRight="Administrator"
          backHref="/admin-dashboard"
          badges={
            <>
              <StatusBadge>● {accountStatus}</StatusBadge>
              <StatusBadge>
                {me.emailVerified ? "✓ Verified" : "○ Unverified"}
              </StatusBadge>
            </>
          }
        />
        <SectionCard title="Account Overview">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard value={me.role ?? "Admin"} label="Role" />
            <StatCard value={accountStatus} label="Account status" />
            <StatCard value={emailStatus} label="Email" />
            <StatCard value={authLabel} label="Authentication" />
          </div>
        </SectionCard>
        <div className="grid gap-4 md:grid-cols-2">
          <SectionCard title="Personal Information">
            <InfoRow label="Full name" value={me.name ?? "—"} />
            <InfoRow label="Email" value={me.email ?? "—"} />
            <InfoRow label="Role" value={me.role ?? "—"} />
            <InfoRow label="User ID" value={me.id ?? "—"} />
          </SectionCard>
          <SectionCard title="Security">
            <InfoRow
              label="Email verified"
              value={me.emailVerified ? "✓ Yes" : "○ No"}
            />
            <InfoRow
              label="Account active"
              value={me.status === "ACTIVE" ? "✓ Yes" : (me.status ?? "—")}
            />
            <InfoRow label="Authentication" value={authLabel} />
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
