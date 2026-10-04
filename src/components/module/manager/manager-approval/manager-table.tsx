"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSuspenseGetAllManagers } from "@/hooks";
import { IManager } from "@/types";
import { useSearchParams } from "next/navigation";
import { ApprovalModal } from "./approval-modal";
import Paginations from "@/shared/pagination";

const DoctorApprovalTable = () => {
  const searchParams = useSearchParams();

  const params = {
    ...Object.fromEntries(searchParams.entries()),
    verificationStatus: "PENDING",
    // emailVerified: "true"
  };

  const { data } = useSuspenseGetAllManagers(params);

  console.log("manager data", data);

  if (!data?.success || !data.meta || data.data.length === 0) {
    return <p className="text-center text-red-600">no pending manager found</p>;
  }

  const allManagers = data.data || [];

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
            {allManagers.map((manager: IManager, idx: number) => {
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
      <Paginations meta={data.meta} />
    </div>
  );
};

export default DoctorApprovalTable;
