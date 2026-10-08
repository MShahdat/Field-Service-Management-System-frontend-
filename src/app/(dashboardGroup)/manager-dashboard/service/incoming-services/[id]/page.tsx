"use client";

import { use } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useEligibleTechnician } from "@/hooks";
import DataNotFoundCard from "@/shared/data-not-found";
import TechnicianAssignPage from "@/components/module/manager-service/technician-assign";
import type { ITechnician } from "@/types/technician.types";
import DetailsSkeleton from "@/loading/details-loading";

const TechnicianPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id: workOrderId } = use(params);

  const { data, isPending, isError } = useEligibleTechnician(workOrderId);

  if (isPending) {
    return <DetailsSkeleton/>
  }

  if (isError || !data?.data) {
    return (
      <div className="w-11/12 mx-auto py-6">
        <DataNotFoundCard
          message="Service not found"
          description="This service may have been deleted or you don't have access."
        />
      </div>
    );
  }

  const raw = (data?.data as { eligibleTech?: unknown })?.eligibleTech;
  const eligibleTech = (Array.isArray(raw) ? raw : []) as ITechnician[];

  if (Array.isArray(data?.data) || !data?.data.service) {
    return (
      <div className="w-11/12 mx-auto py-6">
        <DataNotFoundCard
          message="No eligible technicians"
          description="No technicians match this work order right now."
        />
      </div>
    );
  }

  return (
    <div className="w-11/12 mx-auto py-6 ">
      <TechnicianAssignPage
        service={data.data.service}
        eligibleTech={eligibleTech}
        workOrderId={workOrderId}
      />
    </div>
  );
};

export default TechnicianPage;
