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
import { ISkills } from "@/types/skills.types";
import { SkillModal } from "./skill-modal";
import { StatusUpdateModal } from "./status-update";
import { DeleteStatusModal } from "./delete-sataus-update";

type Props = {
  skills: ISkills[];
};

const SkillsTable = ({ skills }: Props) => {
  // console.log("skills from table", skills);

  if (skills.length === 0) {
    return (
      <DataNotFoundCard
        message="No Skill Found"
        description="There was no skill have been created yet!"
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
              <TableHead>Skill Name</TableHead>
              <TableHead>Category Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Active Status</TableHead>
              <TableHead>Deleted</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skills.map((skill: ISkills, idx: number) => {
              const status = skill.isActive ? "True" : "False";
              const deleted = skill.isDelete ? "True" : "False";
              return (
                <TableRow key={skill.id}>
                  <TableCell className="font-medium">{idx + 1}</TableCell>
                  <TableCell>{skill.name}</TableCell>
                  <TableCell>{skill.category.name}</TableCell>
                  <TableCell>{skill.description ?? " - "}</TableCell>
                  <TableCell>
                    <Badge variant={"secondary"}>{status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={"secondary"}>{deleted}</Badge>
                  </TableCell>
                  <TableCell className="flex items-center justify-end gap-2">
                    <DeleteStatusModal
                      id={skill.id}
                      name={skill.name}
                      isDeleted={skill.isDelete}
                    />
                    <StatusUpdateModal
                      id={skill.id}
                      name={skill.name}
                      status={skill.isActive}
                    />
                    <SkillModal skill={skill} mode="edit" />
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

export default SkillsTable;
