"use client";

import { useSearchParams } from "next/navigation";
import { useGetSingleRegion } from "@/hooks";
import DetailsSkeleton from "@/loading/details-loading";
import DataNotFoundCard from "@/shared/data-not-found";
import PubRegionDetails from "./pub-region-details";

const PubRegionDetailsPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { data, isPending, isError } = useGetSingleRegion(id);

  if (!id) {
    return (
      <DataNotFoundCard
        message="Region not selected"
        description="Open a region from the directory to view its managers and technicians."
      />
    );
  }

  if (isPending) {
    return <DetailsSkeleton />;
  }

  if (isError || !data?.success) {
    return (
      <DataNotFoundCard
        message="Region not found"
        description="This region may have been removed or is no longer available."
      />
    );
  }

  return <PubRegionDetails region={data.data} />;
};

export default PubRegionDetailsPage;
