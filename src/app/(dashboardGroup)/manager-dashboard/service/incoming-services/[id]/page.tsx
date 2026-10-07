"use client";

import { use } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useEligibleTechnician } from "@/hooks";
import DataNotFoundCard from "@/shared/data-not-found";
import TechnicianAssignPage from "@/components/module/manager-service/technician-assign";
import type { ITechnician } from "@/types/technician.types";

const TechnicianPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id: workOrderId } = use(params);

  const { data, isPending, isError } = useEligibleTechnician(workOrderId);

  if (isPending) {
    return (
      <div className="w-11/12 mx-auto py-6 space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="grid lg:grid-cols-[1.7fr_1fr] gap-4">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
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

  // Backend returns [] when no candidates, else { service, eligibleTech }
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
