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
import type { IUser } from "@/types";
import { badgeText, statusVarient } from "@/utils";
import { UserStatusModal } from "./user-status-modal";

type Props = {
  users: IUser[];
};

const UserTable = ({ users }: Props) => {
  if (users.length === 0) {
    return (
      <DataNotFoundCard
        message="No users Found"
        description="There was no users have been created yet!"
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
              <TableHead>Email</TableHead>
              <TableHead>AuthProvider</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Deleted</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user: IUser, idx: number) => {
              const verified = user.emailVerified ? "True" : "False";
              const deleted = user.isDeleted ? "True" : "False";

              return (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{idx + 1}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{badgeText(user.authProvider)}</TableCell>
                  <TableCell>
                    <Badge variant={statusVarient(verified)}>{verified}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVarient(user.status)}>
                      {badgeText(user.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Badge variant={statusVarient(deleted)}>{deleted}</Badge>
                  </TableCell>
                  <TableCell className="flex items-center justify-end gap-2">
                    {user.status === "ACTIVE" ? (
                      <>
                        <UserStatusModal
                          id={user.id}
                          name={user.name}
                          current={user.status}
                          action="BLOCKED"
                        />
                        <UserStatusModal
                          id={user.id}
                          name={user.name}
                          current={user.status}
                          action="DELETED"
                        />
                      </>
                    ) : (
                      <UserStatusModal
                        id={user.id}
                        name={user.name}
                        current={user.status}
                        action="ACTIVE"
                      />
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

export default UserTable;
