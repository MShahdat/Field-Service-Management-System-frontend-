"use client";

import ServiceDetailsView from "@/components/module/services/service-details";
import { Skeleton } from "@/components/ui/skeleton";
import { useSingleService } from "@/hooks";
import DataNotFoundCard from "@/shared/data-not-found";



type Props = {
  id: string,
  backHref?: string
}


const ServiceDetailsPage = ({ id, backHref }: Props) => {

  const { data, isPending, isError } = useSingleService(id);

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

  return (
    <div className="w-11/12 mx-auto py-6 ">
      <ServiceDetailsView
        service={data?.data}
        backHref={backHref || "/"}
      />
    </div>
  );
};

export default ServiceDetailsPage;
