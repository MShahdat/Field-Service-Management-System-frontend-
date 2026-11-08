'use client'

import { useGetRegions } from "@/hooks";
import { CardSkeleton } from "@/loading";
import DataNotFoundCard from "@/shared/data-not-found";
import { IRegion, Meta } from "@/types";
import { useSearchParams } from "next/navigation";
import PubRegionCard from "./pub-region-card";
import Paginations from "@/shared/pagination";
import ShowCount from "@/shared/show.count";


const PubRegionLists = () => {
  const searchParams = useSearchParams()
  const params = Object.fromEntries(searchParams.entries());

  const { data, isPending } = useGetRegions(params);

  if (isPending) {
    return <CardSkeleton />
  }

  if (!data?.success) {
    return <DataNotFoundCard />;
  }
  const regions = data?.data ?? [];
  const meta = data?.meta

  if (regions.length === 0) {
    return <DataNotFoundCard message="Regions Not Found" />
  }

  return (
    <div className="space-y-4">
      <ShowCount length={regions.length} meta={meta} title="regions" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {regions.map((region: IRegion) => (
          <div key={region.id}>
            <PubRegionCard region={region} />
          </div>
        ))}
      </div>
      <Paginations meta={data?.meta as Meta} />
    </div>
  );
};

export default PubRegionLists;