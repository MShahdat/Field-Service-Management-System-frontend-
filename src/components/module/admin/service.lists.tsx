"use client";

import { useGetAllServices } from "@/hooks";
import GenericTableSkeleton from "@/loading/table-loading";
import DataNotFoundCard from "@/shared/data-not-found";
import { Suspense } from "react";
import Paginations from "@/shared/pagination";
import { useSearchParams } from "next/navigation";
import ServiceTable from "./service.table";

const ServiceLists = () => {
  const searchParams = useSearchParams();

  const params = Object.fromEntries(searchParams.entries());

  const { data, isPending } = useGetAllServices(params);
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

  const services = data.data || [];

  return (
    <div className="space-y-4">
      <Suspense
        fallback={<GenericTableSkeleton rowCount={8} columnCount={8} />}
      >
        <ServiceTable services={services} />
      </Suspense>

      <Paginations meta={data?.meta} />
    </div>
  );
};

export default ServiceLists;
