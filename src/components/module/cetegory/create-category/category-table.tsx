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
import { ICategory, IManager } from "@/types";

type Props = {
  categories: ICategory[];
};

const CategoryTable = ({ categories }: Props) => {
  console.log("categories from table", categories);

  if (categories.length === 0) {
    return (
      <DataNotFoundCard
        message="No Category Found"
        description="There was no categoy have been created yet!"
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
              <TableHead>Name</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Active Status</TableHead>
              <TableHead className="">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category: ICategory, idx: number) => {
              const status = category.isActive ? "True" : "False";
              return (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{idx + 1}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.duration}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    <Badge variant={"secondary"}>{status}</Badge>
                  </TableCell>
                  <TableCell className="">
                    {/* <ApprovalModal manager={manager} /> */}
                    edit
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

export default CategoryTable;
