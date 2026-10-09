"use client";

import { usePathname, useRouter } from "next/navigation";
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
import type { Endpoint, IWorkOrder, LoggedUser } from "@/types";
import { badgeText, statusVarient } from "@/utils";
import OrderStatusModal from "./order-status-update";
import {
  formatClock,
  formatServiceDate,
} from "../customer-service/details-util";

type Props = {
  orders: IWorkOrder[];
  user: LoggedUser;
  endpoint: Endpoint;
};

const WorkorderTable = ({ orders, user, endpoint }: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  const today = endpoint === "today";
  const all = endpoint === "all";
  const incoming = endpoint === "incoming";

  return (
    <div className="space-y-4">
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">No</TableHead>
              {incoming && <TableHead>Service Title</TableHead>}
              <TableHead>Service Category</TableHead>
              {!today && <TableHead>Servicing Date</TableHead>}
              {today && <TableHead>Time </TableHead>}
              <TableHead>Priority</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payemnt Status</TableHead>
              {incoming && <TableHead>Location</TableHead>}
              {!incoming && <TableHead>Status</TableHead>}
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order: IWorkOrder, idx: number) => {
              const location =
                order.service.address.street +
                ", " +
                order.service.address.city +
                "-" +
                order.service.address.postalCode;
              return (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{idx + 1}</TableCell>
                  {incoming && (
                    <TableHead>
                      {order.service.title === "" ? "-" : order.service.title}
                    </TableHead>
                  )}
                  <TableCell>{order.service.category.name ?? "-"}</TableCell>
                  {!today && (
                    <TableCell>
                      {formatServiceDate(order.servicingDate)}
                    </TableCell>
                  )}
                  {today && (
                    <TableCell>{`${formatClock(order.service.preferredStartTime)} - ${formatClock(order.service.preferredEndTime)}`}</TableCell>
                  )}
                  <TableCell>
                    <Badge variant={statusVarient(order.service.priority)}>
                      {badgeText(order.service.priority)}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.payment?.amount ?? "_"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={statusVarient(order.payment?.status ?? "UNPAID")}
                    >
                      {badgeText(order.payment?.status ?? "UNPAID")}
                    </Badge>
                  </TableCell>
                  {incoming && <TableCell>{location}</TableCell>}
                  {!incoming && (
                    <TableCell>
                      <Badge variant={statusVarient(order.status)}>
                        {badgeText(order.status)}
                      </Badge>
                    </TableCell>
                  )}

                  <TableCell className="flex items-center justify-end gap-2">
                    <Button
                      variant={"outline"}
                      size={"sm"}
                      onClick={() => {
                        router.push(`${pathname}/${order.id}`);
                      }}
                    >
                      Details
                    </Button>

                    {user.role === "TECHNICIAN" && (
                      <OrderStatusModal order={order} />
                    )}
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

export default WorkorderTable;
