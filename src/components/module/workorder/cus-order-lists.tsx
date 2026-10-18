"use client";

import { useMyOrder } from "@/hooks";
import { CardSkeleton } from "@/loading/card-loading";
import DataNotFoundCard from "@/shared/data-not-found";
import Paginations from "@/shared/pagination";
import { usePathname, useSearchParams } from "next/navigation";
import { IWorkOrder } from "@/types";
import OrderCard from "./cus-order-card";

const OrderLists = () => {
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const pathname = usePathname()

  const { data, isPending } = useMyOrder(params);

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
        message="Order Not Found"
        description="You have not order yet!"
      />
    );
  }

  const orders = data?.data ?? [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {orders.map((order: IWorkOrder) => (
          <div key={order.id}>
            <OrderCard order={order} route={pathname} />
          </div>
        ))}
      </div>
      <Paginations meta={data?.meta} />
    </div>
  );
};

export default OrderLists;
