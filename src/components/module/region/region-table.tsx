"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DataNotFoundCard from "@/shared/data-not-found";
import { IRegion } from "@/types";
import { RegionModal } from "./region-modal";
import { StatusUpdateModal } from "./status-update";

type Props = {
  regions: IRegion[];
};

const RegionTable = ({ regions }: Props) => {
  console.log("regions from table", regions);

  if (regions.length === 0) {
    return (
      <DataNotFoundCard
        message="No Region Found"
        description="There was no region have been created yet!"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">No</TableHead>
              <TableHead>Area Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Active Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {regions.map((region: IRegion, idx: number) => {
              const status = region.isActive ? "True" : "False";
              return (
                <TableRow key={region.id}>
                  <TableCell className="font-medium">{idx + 1}</TableCell>
                  <TableCell>{region.area}</TableCell>
                  <TableCell>{region.description}</TableCell>
                  <TableCell>
                    <Badge variant={"secondary"}>{status}</Badge>
                  </TableCell>
                  <TableCell className="flex items-center justify-end gap-2">
                    <StatusUpdateModal
                      id={region.id}
                      area={region.area}
                      status={region.isActive}
                    />
                    <RegionModal region={region} mode="edit" />
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

export default RegionTable;
