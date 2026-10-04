"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IManager } from "@/types";
import { ApprovalModal } from "./approval-modal";

type Props = {
  managers: IManager[];
};

const DoctorApprovalTable = ({ managers }: Props) => {
  return (
    <div className="space-y-4">
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Covered Region</TableHead>
              <TableHead className="text-right">Review</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {managers.map((manager: IManager, idx: number) => {
              const address =
                manager.address.street +
                " " +
                manager.address.city +
                " " +
                manager.address.postalCode;

              const regions = manager.region.map((region) => region.area);

              return (
                <TableRow key={manager.id}>
                  <TableCell className="font-medium">{idx + 1}</TableCell>
                  <TableCell>{manager.user.name}</TableCell>
                  <TableCell>{manager.user.email}</TableCell>
                  <TableCell>{manager.phone}</TableCell>
                  <TableCell>{address}</TableCell>
                  <TableCell>{regions}</TableCell>
                  <TableCell className="text-right">
                    <ApprovalModal manager={manager} />
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

export default DoctorApprovalTable;
