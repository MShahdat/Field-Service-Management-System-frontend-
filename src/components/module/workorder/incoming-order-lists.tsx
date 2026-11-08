"use client";

import { useGetMe, useMyOrder } from "@/hooks";
import GenericTableSkeleton from "@/loading/table-loading";
import DataNotFoundCard from "@/shared/data-not-found";
import Paginations from "@/shared/pagination";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import WorkorderTable from "./workorder-table";
import ShowCount from "@/shared/show.count";

const IncomingOrderLists = () => {
  const searchParams = useSearchParams();
  const params = {
    ...Object.fromEntries(searchParams.entries()),
    status: "EN_ROUTE",
  };
  const pathname = usePathname()
  const { data, isPending } = useMyOrder(params);
  const { data: me, isPending: mePending } = useGetMe();

  if (isPending || mePending) {
    return <GenericTableSkeleton rowCount={8} columnCount={6} />;
  }

  if (!data?.success || !me.success) {
    return <DataNotFoundCard />;
  }

  const orders = data?.data ?? [];
  const user = me?.data ?? null;

  if (orders.length === 0) {
    return (
      <DataNotFoundCard
        message="No New Order Found"
        description="There was no new order have been created yet!"
      />
    );
  }
  return (
    <div className="space-y-4">
      <ShowCount length={orders?.length} meta={data?.meta} title="orders" />
      <Suspense
        fallback={<GenericTableSkeleton rowCount={8} columnCount={8} />}
      >
        <WorkorderTable orders={orders} endpoint="incoming" user={user} route={pathname} meta={data?.meta} />
      </Suspense>

      <Paginations meta={data?.meta} />
    </div>
  );
};

export default IncomingOrderLists;
