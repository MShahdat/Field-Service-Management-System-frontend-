"use client";

import { useGetAllRegions } from "@/hooks";
import GenericTableSkeleton from "@/loading/table-loading";
import DataNotFoundCard from "@/shared/data-not-found";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import RegionTable from "./region-table";
import Paginations from "@/shared/pagination";

const RegionLists = () => {
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  const { data, isPending } = useGetAllRegions(params);

  if (isPending) {
    return <GenericTableSkeleton rowCount={8} columnCount={6} />;
  }

  if (!data?.success) {
    return <DataNotFoundCard />;
  }

  const regions = data?.data ?? [];

  if (regions.length === 0) {
    return (
      <DataNotFoundCard
        message="No Region Found"
        description="There was no region have been created yet!"
      />
    );
  }
  return (
    <div className="space-y-4">
      <Suspense
        fallback={<GenericTableSkeleton rowCount={8} columnCount={8} />}
      >
        <RegionTable regions={regions} />
      </Suspense>

      <Paginations meta={data?.meta} />
    </div>
  );
};

export default RegionLists;
