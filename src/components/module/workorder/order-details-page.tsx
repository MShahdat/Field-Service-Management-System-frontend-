"use client";

import { useSingleOrder } from "@/hooks";
import DetailsSkeleton from "@/loading/details-loading";
import DataNotFoundCard from "@/shared/data-not-found";
import OrderDetailsView from "./order-details";


type Props = {
  id: string,
  backHref?: string
}


const OrderDetailsPage = ({ id, backHref }: Props) => {

  const { data, isPending, isError } = useSingleOrder(id);

  if (isPending) {
    return <DetailsSkeleton />;
  }

  if (isError || !data?.data || !data?.success) {
    return <DataNotFoundCard
      message="Order not found"
      description="This order may have been deleted or you don't have access."
    />
  }

  return (
    <div className="">
      <OrderDetailsView
        order={data?.data}
      />
    </div>
  );
};

export default OrderDetailsPage;
