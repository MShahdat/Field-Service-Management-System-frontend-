"use client";

import { useCustomerMyService } from "@/hooks";
import GenericTableSkeleton from "@/loading/table-loading";
import DataNotFoundCard from "@/shared/data-not-found";
import { ServiceRequest } from "@/types";
import { useSearchParams } from "next/navigation";
import MyServiceCard from "./service-card";
import Paginations from "@/shared/pagination";

const MyServiceLists = () => {
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  const { data, isPending } = useCustomerMyService(params);

  console.log("my services ", data);

  if (isPending) {
    return <GenericTableSkeleton rowCount={8} columnCount={6} />;
  }

  if (!data?.success || data?.data.length === 0) {
    return (
      <DataNotFoundCard
        message="Service not found"
        description="You have not created any service yet!"
      />
    );
  }

  const services = data?.data ?? [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {services.map((service: ServiceRequest) => (
          <div key={service.id}>
            <MyServiceCard service={service} />
          </div>
        ))}
      </div>
      <Paginations meta={data?.meta} />
    </div>
  );
};

export default MyServiceLists;
