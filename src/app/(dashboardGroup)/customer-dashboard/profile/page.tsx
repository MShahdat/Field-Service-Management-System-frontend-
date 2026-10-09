"use client";

import { formatAddress } from "@/components/module/profile/profile-helpers";
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
import type { ICustomer, ILoggedUser } from "@/types";

const CustomerProfile = () => {
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
          description="We could not load your customer profile. Please try again."
        />
      </div>
    );
  }

  const me = data.data as ILoggedUser;
  const cust: ICustomer | null | undefined = me.customer;

  const phone: string | null = cust?.phone ?? null;
  const addr: string | null = formatAddress(cust?.address);

  const emailStatus = me.emailVerified ? "Verified" : "Unverified";
  const authLabel =
    me.authProvider === "CREDENTIAL" ? "Credential" : (me.authProvider ?? "—");
  const accountStatus = me.status ?? "Active";

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-6">
        <ProfileHeader
          name={me.name ?? "—"}
          email={me.email ?? "—"}
          roleLabel="Customer"
          imageUrl={me.profileImg}
          topRight="My Profile"
          backHref="/customer-dashboard"
          badges={
            <>
              <StatusBadge>● {accountStatus}</StatusBadge>
              <StatusBadge>
                {me.emailVerified ? "✓ Email verified" : "○ Email unverified"}
              </StatusBadge>
            </>
          }
        />
        <div className="grid gap-4 md:grid-cols-2">
          <SectionCard title="Personal Information">
            <InfoRow label="Full name" value={me.name ?? "—"} />
            <InfoRow label="Email" value={me.email ?? "—"} />
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
              <StatCard value={accountStatus} label="Account status" />
              <StatCard value={emailStatus} label="Email" />
              <StatCard value={authLabel} label="Authentication" />
              <StatCard value="—" label="Member since" />
            </div>
            <p className="pt-3 text-[13px] text-muted-foreground">
              Customer ID: {cust?.id ?? me.id ?? "—"}
            </p>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
