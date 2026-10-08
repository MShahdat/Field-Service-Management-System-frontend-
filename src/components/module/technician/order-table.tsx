"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IRegion, IWorkOrder } from "@/types";
import { badgeText, statusVarient } from "@/utils";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  orders: IWorkOrder[];
};

const OrderTable = ({ orders }: Props) => {

  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className="space-y-4">
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">No</TableHead>
              <TableHead>Service Category</TableHead>
              <TableHead>Servicing Date</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payemnt Status</TableHead>
              <TableHead>Status</TableHead>
              <TableHead 
              className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order: IWorkOrder, idx: number) => {
              // const status = region.isActive ? "True" : "False";
              return (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{idx + 1}</TableCell>
                  <TableCell>{order.service.category.name ?? "-"}</TableCell>
                  <TableCell>{order.servicingDate}</TableCell>
                  <TableCell>
                    <Badge variant={statusVarient(order.service.priority)}>
                      {badgeText(order.service.priority)}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.payment?.amount ?? "_"}</TableCell>
                  <TableCell>
                    <Badge variant={statusVarient(order.payment?.status ?? "UNPAID")}>
                      {badgeText(order.service.priority ?? "UNPAID")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVarient(order.status)}>
                      {badgeText(order.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex items-center justify-end gap-2">
                    <Button
                     variant={"outline"}
                     onClick={() => {
                      router.push(`${pathname}/${order.id}`)
                     }}
                    >
                      Details
                    </Button>
                    {/* <StatusUpdateModal
                      id={region.id}
                      area={region.area}
                      status={region.isActive}
                    /> */}
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

export default OrderTable;
