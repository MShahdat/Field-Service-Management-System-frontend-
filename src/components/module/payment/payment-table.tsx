"use client";

import { Badge, badgeVariants } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IPayment, IService } from "@/types";
import { badgeText, formatDuration, statusVarient } from "@/utils";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import {
  formatDateTime,
  formatMoney,
  formatServiceDate,
} from "../customer-service/details-util";
import { PaymentDetails } from "./payment-modal";

type Props = {
  payments: IPayment[];
};

const PaymentTable = ({ payments }: Props) => {
  return (
    <div className="space-y-4">
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">No</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Servicing Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Trx ID</TableHead>
              <TableHead>Paid At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment: IPayment, idx: number) => {
              return (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{idx + 1}</TableCell>
                  <TableCell>
                    {payment.workOrder.service.category.name ?? "Service"}
                  </TableCell>
                  <TableCell>
                    {formatServiceDate(payment.workOrder.service.servicingDate)}
                  </TableCell>
                  <TableCell>{formatMoney(payment.amount)}</TableCell>
                  <TableCell>{payment.transectionId ?? "-"}</TableCell>
                  <TableCell>
                    {payment.paidAt ? (
                      formatDateTime(payment.paidAt)
                    ) : (
                      <p className="text-sm text-red-600">Payment not yet!</p>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVarient(payment.status)}>
                      {badgeText(payment.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <PaymentDetails payment={payment} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PaymentTable;
