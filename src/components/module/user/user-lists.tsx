"use client";

import { useGetAllUsers } from "@/hooks";
import GenericTableSkeleton from "@/loading/table-loading";
import DataNotFoundCard from "@/shared/data-not-found";
import Paginations from "@/shared/pagination";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import UserTable from "./user-table";
import ShowCount from "@/shared/show.count";

const UserLists = () => {
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  const { data, isPending, isError } = useGetAllUsers(params);

  const users = data?.data ?? []
  const meta = data?.meta
  // console.log("users", data);

  if (isPending) {
    return <GenericTableSkeleton columnCount={6} rowCount={8} />;
  }

  if (isError) {
    return <DataNotFoundCard />
  }

  if (data?.data?.length === 0) {
    return (
      <DataNotFoundCard
        message="Users not found"
        description="There was no Users created yet by admin"
      />
    );
  }
  return (
    <div className="space-y-4">
      <ShowCount length={users.length} meta={meta} title="users" />
      <Suspense
        fallback={<GenericTableSkeleton rowCount={6} columnCount={8} />}
      >
        <UserTable users={data?.data} meta={data?.meta} />
      </Suspense>

      <Paginations meta={data?.meta} />
    </div>
  );
};

export default UserLists;
