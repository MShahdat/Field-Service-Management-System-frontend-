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
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  services: IService[];
  route: string
};

const IncomingServiceTable = ({ services, route }: Props) => {
  const router = useRouter();

  console.log('incomming services by manager', services)

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
              const params = new URLSearchParams({ id: service.workOrders?.id as string })

              return (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{idx + 1}</TableCell>
                  <TableCell>
                    {service.title ?? "-"}
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
                            router.replace(`${route}/assign?${params.toString()}`)
                            router.refresh()
                          }}
                          type="button"
                          variant="accepted"
                          size={"sm"}
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
