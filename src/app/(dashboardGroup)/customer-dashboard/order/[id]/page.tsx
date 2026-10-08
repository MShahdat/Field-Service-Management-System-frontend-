"use client";

import { use } from "react";
import OrderDetailsView from "@/components/module/customer-service/order-details";
import { Skeleton } from "@/components/ui/skeleton";
import { useSingleOrder } from "@/hooks";
import DataNotFoundCard from "@/shared/data-not-found";
import DetailsSkeleton from "@/loading/details-loading";

const OrderDetailsPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);

  const { data, isPending, isError } = useSingleOrder(id);

  if (isPending) {
    return <DetailsSkeleton />;
  }

  if (isError || !data?.data) {
    return (
      <div className="w-11/12 mx-auto py-6">
        <DataNotFoundCard
          message="Order not found"
          description="This order may have been deleted or you don't have access."
        />
      </div>
    );
  }

  return (
    <div className="w-11/12 mx-auto py-6">
      <OrderDetailsView
        order={data.data}
        backHref="/customer-dashboard/order"
        label="Order"
      />
    </div>
  );
};

export default OrderDetailsPage;
