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
import { IService } from "@/types";
import { badgeText, formatDuration, statusVarient } from "@/utils";
import { ServiceReviewModal } from "./review-modal";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  services: IService[];
};

const IncomingServiceTable = ({ services }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  console.log("pathname", pathname);

  return (
    <div className="space-y-4">
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">No</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Servicing Date</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service: IService, idx: number) => {
              return (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{idx + 1}</TableCell>
                  <TableCell>
                    {service.title === "" ? "-" : service.title}
                  </TableCell>
                  <TableCell>{service.category.name ?? "-"}</TableCell>
                  <TableCell>{service.servicingDate ?? "-"}</TableCell>
                  <TableCell>{formatDuration(service.duration)}</TableCell>
                  <TableCell>
                    <Badge variant={statusVarient(service.priority)}>
                      {badgeText(service.priority)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 items-center justify-end">
                      {service.status === "PENDING" && (
                        <Button
                          onClick={() => {
                            router.push(
                              `${pathname}/${service.workOrders?.id}`,
                            );
                            console.log("work id ", service.workOrders?.id);
                          }}
                          type="button"
                          variant="accepted"
                        >
                          Assign
                        </Button>
                      )}
                    </div>
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

export default IncomingServiceTable;
