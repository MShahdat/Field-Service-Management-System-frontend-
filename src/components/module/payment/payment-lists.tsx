"use client";

import { useSearchParams } from "next/navigation";
import { useGetMe, useGetPaymentInfo } from "@/hooks";
import { CardSkeleton } from "@/loading/card-loading";
import DataNotFoundCard from "@/shared/data-not-found";
import Paginations from "@/shared/pagination";
import type { IPayment } from "@/types";
import PaymentCard from "./payment-card";
import PaymentTable from "./payment-table";
import GenericTableSkeleton from "@/loading/table-loading";

const PaymentLists = () => {
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  const { data, isPending } = useGetPaymentInfo(params);
  const { data: me } = useGetMe();

  if (isPending) {
    return <GenericTableSkeleton rowCount={8} columnCount={8} />;
  }

  if (!data?.success || data?.data.length === 0) {
    return (
      <DataNotFoundCard
        message="payment not found"
        description="You have no payments yet!"
      />
    );
  }

  const payments = (data?.data ?? []) as IPayment[];
  const user = me?.data ?? null;

  const cus = user.role === "CUSTOMER";
  return (
    <div className="space-y-4">
      {cus && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {payments.map((payment: IPayment) => (
            <div key={payment.id}>
              <PaymentCard payment={payment} />
            </div>
          ))}
        </div>
      )}
      {!cus && <PaymentTable payments={payments} />}
      <Paginations meta={data?.meta} />
    </div>
  );
};

export default PaymentLists;
