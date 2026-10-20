"use client";

import { useCustomerMyService } from "@/hooks";
import DataNotFoundCard from "@/shared/data-not-found";
import { ServiceRequest } from "@/types";
import { usePathname, useSearchParams } from "next/navigation";
import Paginations from "@/shared/pagination";
import { CardSkeleton } from "@/loading/card-loading";
import MyServiceCard from "./cus-service-card";

const TodayMyServiceLists = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname()
  const params = {
    ...Object.fromEntries(searchParams.entries()),
    today: true
  }

  const { data, isPending } = useCustomerMyService(params);

  if (isPending) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <div key={index as number}>
            <CardSkeleton />
          </div>
        ))}
      </div>
    );
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {services.map((service: ServiceRequest) => (
          <div key={service.id}>
            <MyServiceCard service={service} route={pathname} />
          </div>
        ))}
      </div>
      <Paginations meta={data?.meta} />
    </div>
  );
};

export default TodayMyServiceLists;
