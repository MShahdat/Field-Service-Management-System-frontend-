"use client";

import { useGetAllUsers } from "@/hooks";
import GenericTableSkeleton from "@/loading/table-loading";
import DataNotFoundCard from "@/shared/data-not-found";
import Paginations from "@/shared/pagination";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import UserTable from "./user-table";

const UserLists = () => {
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  const { data, isPending } = useGetAllUsers(params);

  console.log("users", data);

  if (isPending) {
    return <GenericTableSkeleton columnCount={6} rowCount={8} />;
  }

  if (!data?.success) {
    return (
      <DataNotFoundCard
        message="Users not found"
        description="There was no Users created yet by admin"
      />
    );
  }
  return (
    <div className="space-y-4">
      <Suspense
        fallback={<GenericTableSkeleton rowCount={6} columnCount={8} />}
      >
        <UserTable users={data?.data} />
      </Suspense>

      <Paginations meta={data?.meta} />
    </div>
  );
};

export default UserLists;
