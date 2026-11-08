"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useGetAllRegions } from "@/hooks";
import GenericTableSkeleton from "@/loading/table-loading";
import DataNotFoundCard from "@/shared/data-not-found";
import Paginations from "@/shared/pagination";
import RegionTable from "./region-table";
import ShowCount from "@/shared/show.count";

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
      <ShowCount length={regions?.length} meta={data?.meta} title="regions" />
      <Suspense
        fallback={<GenericTableSkeleton rowCount={8} columnCount={8} />}
      >
        <RegionTable regions={regions} meta={data?.meta} />
      </Suspense>

      {data.meta && <Paginations meta={data.meta} />}
    </div>
  );
};

export default RegionLists;
