"use client";

import ServiceDetailsView from "@/components/module/services/service-details";
import { Skeleton } from "@/components/ui/skeleton";
import { useSingleService } from "@/hooks";
import DetailsSkeleton from "@/loading/details-loading";
import DataNotFoundCard from "@/shared/data-not-found";



type Props = {
  id: string,
  backHref?: string
}


const ServiceDetailsPage = ({ id, backHref }: Props) => {

  const { data, isPending, isError } = useSingleService(id);

  if (isPending) {
    return <DetailsSkeleton />
  }

  if (isError || !data?.data || !data?.success) {
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
