"use client";

import { useGetMe, useMyOrder } from "@/hooks";
import GenericTableSkeleton from "@/loading/table-loading";
import DataNotFoundCard from "@/shared/data-not-found";
import Paginations from "@/shared/pagination";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import WorkorderTable from "./workorder-table";
import { Endpoint } from "@/types";

const WorkorderLists = () => {
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  const { data: me, isPending: mePending } = useGetMe();
  const { data: orderData, isPending: orderPending } = useMyOrder(params);

  if (mePending || orderPending) {
    return <GenericTableSkeleton rowCount={8} columnCount={6} />;
  }

  if (!me?.success || !orderData?.success) {
    return <DataNotFoundCard />;
  }

  const orders = orderData?.data ?? [];
  const user = me?.data ?? null;

  if (orders.length === 0) {
    return (
      <DataNotFoundCard
        message="No work order found"
        description="There was no order have been created yet!"
      />
    );
  }
  return (
    <div className="space-y-4">
      <Suspense
        fallback={<GenericTableSkeleton rowCount={8} columnCount={8} />}
      >
        <WorkorderTable orders={orders} user={user} endpoint="all" />
      </Suspense>

      <Paginations meta={orderData?.meta} />
    </div>
  );
};

export default WorkorderLists;
