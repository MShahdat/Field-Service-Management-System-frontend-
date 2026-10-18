'use client'

import OrderDetailsPage from '@/components/module/workorder/order-details-page';
import Breadcrumb from '@/shared/breadcrumb';
import { useSearchParams } from 'next/navigation';


const OrderDetails = () => {
  const params = useSearchParams()
  const id = params.get('id')

  const backHref = '/technician-dashboard/workorder/incoming-order'
  return (
    <div className="w-11/12 mx-auto py-6">
      <Breadcrumb
        backHref={backHref}
        back="Incoming Order"
        current="Order Details"
      />
      <OrderDetailsPage
        id={id as string}
        backHref={backHref}
      />
    </div>
  );
};

export default OrderDetails;