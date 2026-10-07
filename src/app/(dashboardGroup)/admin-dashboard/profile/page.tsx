"use client";

import { formatMemberSince } from "@/components/module/profile/profile-helpers";
import {
  InfoRow,
  ProfileHeader,
  SectionCard,
  StatCard,
  StatusBadge,
} from "@/components/module/profile/profile-ui";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMe } from "@/hooks";

const AdminProfile = () => {
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

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-6">
        <ProfileHeader
          name={user?.name ?? "Tester Admin"}
          email={user?.email ?? "testeradmin@gmail.com"}
          roleLabel="System Administrator"
          imageUrl={user?.profileImg}
          topRight="Administrator"
          backHref="/admin-dashboard"
          badges={
            <>
              <StatusBadge>● Active</StatusBadge>
              <StatusBadge>✓ Verified</StatusBadge>
            </>
          }
        />
        <SectionCard title="Account Overview">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard value="Admin" label="Role" />
            <StatCard value="Active" label="Account status" />
            <StatCard
              value={user?.emailVerified === false ? "Unverified" : "Verified"}
              label="Email"
            />
            <StatCard value="Credential" label="Authentication" />
          </div>
        </SectionCard>
        <div className="grid gap-4 md:grid-cols-2">
          <SectionCard title="Security">
            <InfoRow label="Email verified" value="✓" />
            <InfoRow label="Account active" value="✓" />
            <InfoRow label="Credential authentication" value="✓" />
            <div className="pt-4">
              <Button variant="outline" className="font-bold">
                Change Password
              </Button>
            </div>
          </SectionCard>
          <SectionCard title="Account">
            <InfoRow
              label="Created"
              value={formatMemberSince(user?.createdAt ?? "2026-09-07")}
            />
            <InfoRow
              label="Last updated"
              value={formatMemberSince(user?.updatedAt ?? "2026-09-07")}
            />
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
