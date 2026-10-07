"use client";

import { useGetMyRegionService } from "@/hooks";
import GenericTableSkeleton from "@/loading/table-loading";
import DataNotFoundCard from "@/shared/data-not-found";
import { Suspense } from "react";
import Paginations from "@/shared/pagination";
import { useSearchParams } from "next/navigation";
import IncomingServiceTable from "./incoming-service-table";

const IncomingServiceLists = () => {
  const searchParams = useSearchParams();

  const params = {
    ...Object.fromEntries(searchParams.entries()),
    status: "PENDING",
  };

  const { data, isPending } = useGetMyRegionService(params);
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
        message="No incoming service found"
        description="There was no new services in this region"
      />
    );
  }

  const services = data.data || [];

  return (
    <div className="space-y-4">
      <Suspense
        fallback={<GenericTableSkeleton rowCount={8} columnCount={8} />}
      >
        <IncomingServiceTable services={services} />
      </Suspense>

      <Paginations meta={data?.meta} />
    </div>
  );
};

export default IncomingServiceLists;
