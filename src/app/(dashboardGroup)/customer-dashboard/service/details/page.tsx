'use client'


import ServiceDetailsView from "@/components/module/services/service-details";
import { useSingleService } from "@/hooks";
import DetailsSkeleton from "@/loading/details-loading";
import Breadcrumb from "@/shared/breadcrumb";
import DataNotFoundCard from "@/shared/data-not-found";
import { useSearchParams } from "next/navigation";


const DetailsPage = () => {
  const params = useSearchParams()
  const id = params.get('id')

  const { data, isPending } = useSingleService(id as string)

  const backHref = `/customer-dashboard/service/my-services`;

  if (isPending) {
    return <DetailsSkeleton />
  }

  if (!data.success) {
    return (
      <div className="w-11/12 mx-auto py-6">
        <DataNotFoundCard
          message="Service not found"
          description="This service may have been deleted or you don't have access."
        />
      </div>
    );
  }

  console.log(data?.data)

  return (
    <div className="w-11/12 mx-auto py-6">
      <Breadcrumb
        backHref={backHref}
        back="My Services"
        current="Service Details"
      />
      <ServiceDetailsView
        service={data?.data}
        backHref={backHref}
      />
    </div>
  );
};

export default DetailsPage;