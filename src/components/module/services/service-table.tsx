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
import { IService, UserRole } from "@/types";
import { badgeText, formatDuration, statusVarient } from "@/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Props = {
  services: IService[];
  role?: "MANAGER" | "ADMIN" | "SUPER_ADMIN"
};

const ServiceTable = ({ services, role }: Props) => {
  const router = useRouter();
  console.log('role ', role)

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

              const params = new URLSearchParams({ id: service.id })
              const href = role === "MANAGER" ? "manager-dashboard" : "admin-dashboard"

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
                            router.replace(`/${href}/service/details?${params.toString()}`);
                            router.refresh()
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
