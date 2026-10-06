"use client";

import { useGetMyRegionService, useSuspenseGetAllManagers } from "@/hooks";
import GenericTableSkeleton from "@/loading/table-loading";
import DataNotFoundCard from "@/shared/data-not-found";
import { Suspense } from "react";
import Paginations from "@/shared/pagination";

const ServiceLists = () => {
  const { data, isPending } = useGetMyRegionService();
  console.log("data", data);
  if (isPending) {
    return <GenericTableSkeleton rowCount={8} columnCount={6} />;
  }

  if (!data?.success) {
    return;
  }

  if (data.data.length === 0) {
    return (
      <DataNotFoundCard
        message="Service Not found"
        description="There was no services for this region"
      />
    );
  }

  const managers = data.data || [];
  return (
    <div className="space-y-4">
      <Suspense
        fallback={<GenericTableSkeleton rowCount={8} columnCount={8} />}
      >
        {/* <ManagerTable managers={managers} /> */}
      </Suspense>

      <Paginations meta={data?.meta} />
    </div>
  );
};

export default ServiceLists;
