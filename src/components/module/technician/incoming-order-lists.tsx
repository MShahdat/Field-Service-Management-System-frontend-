'use client'


import { useMyOrder } from '@/hooks';
import GenericTableSkeleton from '@/loading/table-loading';
import DataNotFoundCard from '@/shared/data-not-found';
import Paginations from '@/shared/pagination';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import IncomingOrderTable from './incoming-order-table';


const IncomingOrderLists = () => {
  const searchParams = useSearchParams();
  const params = {
    ... Object.fromEntries(searchParams.entries()),
    status: "EN_ROUTE"
  }
  const { data, isPending } = useMyOrder(params);

  if (isPending) {
    return <GenericTableSkeleton rowCount={8} columnCount={6} />;
  }

  if (!data?.success) {
    return <DataNotFoundCard />;
  }

  const orders = data?.data ?? [];

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
      <Suspense
        fallback={<GenericTableSkeleton rowCount={8} columnCount={8} />}
      >
        <IncomingOrderTable orders={orders}/>
      </Suspense>

      <Paginations meta={data?.meta} />
    </div>
  );
};

export default IncomingOrderLists;