"use client";

import { useSuspenseGetAllManagers } from "@/hooks";
import GenericTableSkeleton from "@/loading/table-loading";
import DataNotFoundCard from "@/shared/data-not-found";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ManagerTable from "./manager-table";
import Paginations from "@/shared/pagination";

const PendingManagerLists = () => {
  const searchParams = useSearchParams();

  const params = {
    ...Object.fromEntries(searchParams.entries()),
    verificationStatus: "PENDING",
    emailVerified: "true",
  };

  const { data, isPending } = useSuspenseGetAllManagers(params);

  if (isPending) {
    return <GenericTableSkeleton rowCount={8} columnCount={6} />;
  }

  if (!data?.success) {
    return;
  }

  if (data.data.length === 0) {
    return (
      <DataNotFoundCard
        message="Pending Manger Not Found"
        description="There was no new incomming request as a manager role"
      />
    );
  }

  const managers = data.data || [];
  return (
    <div className="space-y-4">
      <Suspense
        fallback={<GenericTableSkeleton rowCount={8} columnCount={8} />}
      >
        <ManagerTable managers={managers} />
      </Suspense>

      <Paginations meta={data?.meta} />
    </div>
  );
};

export default PendingManagerLists;
