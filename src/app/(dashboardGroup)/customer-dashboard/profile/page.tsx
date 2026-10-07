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

const CustomerProfile = () => {
  const { data, isPending } = useGetMe();

  if (isPending) {
    return (
      <div className="mx-auto max-w-6xl p-4">
        <Skeleton className="h-44 rounded-2xl" />
      </div>
    );
  }

  const me = data?.data as any;
  const user = me?.user ?? me ?? {};
  const cust = me?.customer ?? {};
  const phone: string | null = cust?.phone ?? user?.phone ?? null;
  const addrObj = cust?.address;
  const addr: string | null = addrObj
    ? [addrObj.street, addrObj.city, addrObj.postalCode]
        .filter(Boolean)
        .join(", ") || null
    : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-6">
        <ProfileHeader
          name={user?.name ?? "Test Customer 01"}
          email={user?.email ?? "cust.test1@mail.com"}
          roleLabel="Customer"
          imageUrl={user?.profileImg}
          topRight="My Profile"
          backHref="/customer-dashboard"
          badges={
            <>
              <StatusBadge>● Active</StatusBadge>
              <StatusBadge>✓ Email verified</StatusBadge>
            </>
          }
        />
        <div className="grid gap-4 md:grid-cols-2">
          <SectionCard title="Personal Information">
            <InfoRow
              label="Full name"
              value={user?.name ?? "Test Customer 01"}
            />
            <InfoRow
              label="Email"
              value={user?.email ?? "cust.test1@mail.com"}
            />
            {phone ? (
              <InfoRow label="Phone" value={phone} />
            ) : (
              <InfoRow label="Phone" value="Not added yet" muted />
            )}
            {addr ? (
              <InfoRow label="Address" value={addr} />
            ) : (
              <InfoRow label="Address" value="Not added yet" muted />
            )}
            {(!phone || !addr) && (
              <p className="pt-3 text-[14px] text-muted-foreground">
                Add your phone and address so we can reach you for bookings.
              </p>
            )}
          </SectionCard>
          <SectionCard title="Account">
            <div className="grid grid-cols-2 gap-3">
              <StatCard value="Active" label="Account status" />
              <StatCard
                value={
                  user?.emailVerified === false ? "Unverified" : "Verified"
                }
                label="Email"
              />
              <StatCard
                value={
                  user?.authProvider === "CREDENTIAL" || !user?.authProvider
                    ? "Credential"
                    : String(user.authProvider)
                }
                label="Authentication"
              />
              <StatCard
                value={
                  user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Oct 7, 2026"
                }
                label="Member since"
              />
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
