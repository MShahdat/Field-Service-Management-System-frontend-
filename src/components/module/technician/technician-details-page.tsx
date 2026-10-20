"use client";

import { useSearchParams } from "next/navigation";
import { useGetTechById } from "@/hooks";
import DetailsSkeleton from "@/loading/details-loading";
import DataNotFoundCard from "@/shared/data-not-found";
import TechnicianDetailsView from "./technician-details";

const TechnicianDetailsPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { data, isPending, isError } = useGetTechById(id);

  if (!id) {
    return (
      <DataNotFoundCard
        message="Technician not selected"
        description="Open a technician from the directory to view their full profile."
      />
    );
  }

  if (isPending) {
    return <DetailsSkeleton />;
  }

  if (isError || !data?.success) {
    return (
      <DataNotFoundCard
        message="Technician not found"
        description="This profile may have been removed or is no longer available."
      />
    );
  }

  return <TechnicianDetailsView technician={data.data} />;
};

export default TechnicianDetailsPage;
