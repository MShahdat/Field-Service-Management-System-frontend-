"use client";

import { useGetMyRegionService } from "@/hooks";
import GenericTableSkeleton from "@/loading/table-loading";
import DataNotFoundCard from "@/shared/data-not-found";
import { Suspense } from "react";
import Paginations from "@/shared/pagination";
import { useSearchParams } from "next/navigation";
import ServiceTable from "./service-table";
import ShowCount from "@/shared/show.count";

const ServiceLists = () => {
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  const { data, isPending } = useGetMyRegionService(params);


  if (isPending) {
    return <GenericTableSkeleton rowCount={8} columnCount={6} />;
  }

  if (!data?.success) {
    return <DataNotFoundCard />;
  }

  if (data.data.length === 0) {
    return (
      <DataNotFoundCard
        message="Service Not found"
        description="There was no services for this region"
      />
    );
  }

  const services = data?.data || [];

  return (
    <div className="space-y-4">
      <ShowCount length={services?.length} meta={data?.meta} title="services" />
      <Suspense
        fallback={<GenericTableSkeleton rowCount={8} columnCount={8} />}
      >
        <ServiceTable services={services} meta={data?.meta} />
      </Suspense>

      <Paginations meta={data?.meta} />
    </div>
  );
};

export default ServiceLists;
