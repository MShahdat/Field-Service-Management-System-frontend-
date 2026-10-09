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
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  services: IService[];
};

const ServiceTable = ({ services }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  // console.log("pathname", pathname);

  console.log("services", services);
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
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Review</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service: IService, idx: number) => {
              const isView =
                service.status === "PENDING" ||
                service.status === "APPROVED" ||
                service.status === "ASSIGNED" ||
                service.status === "COMPLETED" ||
                service.status === "IN_PROGRESS";

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
                  <TableCell>
                    <Badge variant={statusVarient(service.status)}>
                      {badgeText(service.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 items-center justify-end">
                      {isView && (
                        <Button
                          size={"sm"}
                          onClick={() => {
                            router.push(`${pathname}/${service.id}`);
                          }}
                          type="button"
                          variant="outline"
                        >
                          Details
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

export default ServiceTable;
